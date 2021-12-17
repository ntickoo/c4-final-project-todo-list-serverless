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
        logger.info('TodoService - getAllTodos for userid', userId)
        return todosAccess.getAllTodos(userId)
    }

    async createTodo(userId: string, todoDto:CreateTodoRequest) : Promise<TodoItem> {
        logger.info(`TodoService - createTodo for ${userId}', create dto ${todoDto}`)
        const todoId = uuid.v4()

        let todoItem: TodoItem = {
            createdAt: new Date().toISOString(),
            done: false,
            dueDate: todoDto.dueDate,
            name: todoDto.name,
            userId: userId,
            todoId: todoId,
        }
        return todosAccess.createTodo(todoItem)
    }
}

