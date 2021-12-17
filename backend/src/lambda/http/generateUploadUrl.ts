import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import * as uuid from 'uuid'
import { createAttachmentPresignedUrl } from '../../helpers/attachmentUtils'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { TodoService } from '../../helpers/todos'

const logger = createLogger('auth')

const todoSerice = new TodoService()

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

    logger.info('Generate Upload Signed url for todo item - Processing event: ', event)

    const todoId  = event.pathParameters.todoId
    const userId  = getUserId(event)
    if(!todoSerice.getTodoItem(todoId, userId)) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "TodoId does not exist for this user.",
        }),
      };
    }

    const imageId = uuid.v4();

    await todoSerice.updateImageUrlForTodoItem(todoId, userId, imageId) 
    const signedUrl = createAttachmentPresignedUrl(imageId);
    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl: signedUrl,
      }),
    };
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
