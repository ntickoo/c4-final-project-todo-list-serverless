import { UserInfoService } from "../../helpers/userInfoService";
import { UserInfo } from "../../models/UserInfo";
import { createLogger } from "../../utils/logger";
import * as ejs from "ejs";
import * as path from "path";
import { TodoItem } from "../../models/TodoItem";
import { TodoService } from "../../helpers/todos";
import { EmailService } from "../../helpers/EmailService";

const logger = createLogger('sendTodoNotificationLambda')

const userInfoService = new UserInfoService()
const todoService = new TodoService()

exports.handler = async (event) => {
    logger.info(`sendTodoNotificationLambda ${event} `)

    const allUsers : UserInfo[] = await userInfoService.getAllUserInfo();

    logger.info(`Number of users to be notified - ${allUsers.length}`)
    allUsers.forEach(async(usr) => {
        logger.info(`Processing notification process for ${usr}`);
    
        const userTodos: TodoItem[] = await todoService.getAllTodos(usr.userId)
    
        if (userTodos && userTodos.length > 0) {
          const pendingTodoItems   : TodoItem[] = userTodos.filter((todo) => !todo.done);
          const completedTodoItems : TodoItem[] = userTodos.filter((todo) => todo.done);
          const hasPendingTodos    : boolean    = pendingTodoItems      && pendingTodoItems.length   > 0;
          const hasCompletedTodos  : boolean    = completedTodoItems    && completedTodoItems.length > 0;
    
          const ejsParams = {
            pendingTodos        : pendingTodoItems  ,
            completedTodos      : completedTodoItems,
            hasPendingTodos     : hasPendingTodos   ,
            hasCompletedTodos   : hasCompletedTodos ,
          };
    
          ejs.renderFile(
            path.join(__dirname,'templates/todo-notification.ejs'),
            ejsParams,
            async function (err, data) {
              if (err) {
                logger.info('Error while parsing ejs template', err);
              } else {
                const emailService : EmailService = new EmailService();
                await emailService.sendMail({
                  body: data,
                  to: usr.email,
                  subject: "Todo List - Reminder - Udacity Capstone"
                })
                logger.info(`Email sent successfully for ${usr.userId} ${usr.email}`);
              }
            }
          );
        }
      });

    const response = {
        statusCode: 200,
        body: JSON.stringify('All emails sent successfully.'),
    };
    return response;
};
