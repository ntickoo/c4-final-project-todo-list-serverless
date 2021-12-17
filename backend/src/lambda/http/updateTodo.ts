import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { TodoService } from '../../helpers/todos'
import { TodoItem } from '../../models/TodoItem'

const logger = createLogger('auth')

const todoSerice = new TodoService()

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId                          = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest  = JSON.parse(event.body)
    const userId                          = getUserId(event)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    if(!todoSerice.getTodoItem(todoId, userId)) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "TodoId does not exist for this user.",
        }),
      };
    }


    await todoSerice.updateTodoItem(todoId, updatedTodo, userId)
    return {
      statusCode: 204,
      body: ''
    }
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
