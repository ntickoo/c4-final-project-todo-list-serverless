import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { UserInfo } from '../models/UserInfo'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('UserInfoAccess')

export class UserInfoAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly userInfoTable = process.env.USER_INFO_TABLE
  ) {}

  async getUserInfo(userId: string): Promise<UserInfo> {
    logger.info(`Getting UserInfo for user id ${userId}`)

    const result = await this.docClient
      .get({
        TableName: this.userInfoTable,
        Key: {
          userId: userId
        }
      })
      .promise()

    return result.Item as UserInfo
  }

  async getAll(): Promise<UserInfo[]> {
    logger.info(`Getting all User Info`)

    let nextkey
    let limit = 30
    var finalResult = []
    do {
      const scanParams = {
        TableName: this.userInfoTable,
        Limit: limit,
        ExclusiveStartKey: nextkey
      }

      const result = await this.docClient.scan(scanParams).promise()
      const items = result.Items

      finalResult.push(...items)

      var lastEvaluatedKey = result.LastEvaluatedKey
      nextkey = lastEvaluatedKey
      console.log('Result: ', result)
    } while (lastEvaluatedKey && finalResult.length < limit)

    return finalResult as UserInfo[]
  }

  async saveUserInfo(userInfo: UserInfo) {
    logger.info(`Insert if not exists or Update userInfo ${userInfo}`)

    var params = {
      TableName: this.userInfoTable,
      Key: {
        userId: userInfo.userId
      },
      UpdateExpression: 'set #userIdAlias = :userId, #emailAlias=:email',

      ExpressionAttributeValues: {
        ':userId': userInfo.userId,
        ':email': userInfo.email
      },

      ExpressionAttributeNames: {
        '#userIdAlias': 'userId',
        '#emailAlias': 'email'
      },
      ReturnValues: 'NONE'
    }

    await this.docClient.update(params).promise()
  }

  async deleteUserInfo(userId: string) {
    logger.info(`Delete user info for- ${userId}`)
    await this.docClient
      .delete({
        TableName: this.userInfoTable,
        Key: {
          userId: userId
        }
      })
      .promise()
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
