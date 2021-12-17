import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE
  ) {}

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Getting all TodoItems for userid', userId)

    return null
  }

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    logger.info('Create todo item - ', todoItem)

    return null
  }

  async deleteTodo(userId: string, todoId: TodoItem) {
    logger.info('Delete todo item - ', userId, todoId)

  }

  async updateTodo(userId: string, todoUpdateDto: TodoUpdate): Promise<TodoItem> {
    logger.info(`Update todo item ${todoUpdateDto} for userId ${userId}`)
    return null
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
