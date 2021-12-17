import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

// TODO: Implement businessLogic
const todosAccess = new TodosAccess()
const logger = createLogger('TodosAccess')

export class TodoService {
    async getAllTodos(userId: string) : Promise<TodoItem[]> {
        logger.info('Inside TodoService - getAllTodos for userid', userId)
        return todosAccess.getAllTodos(userId)
    }
}

