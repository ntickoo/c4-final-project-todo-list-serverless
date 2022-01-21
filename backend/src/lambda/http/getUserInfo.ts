import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId} from '../utils';
import { createLogger } from '../../utils/logger'
import { UserInfoService } from '../../helpers/userInfoService';

const logger = createLogger('getUserInfoLambda')

const userInfoService = new UserInfoService()

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    logger.info(`Get UserInfo - Processing event: ${event}`)
    const userId    = getUserId(event)
    const userInfo  = await userInfoService.getUserInfo(userId)

    logger.info(`User Info fetched successfully for userId ${userId}`)
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: userInfo
      })
    }
})
handler.use(
  cors({
    credentials: true
  })
)
