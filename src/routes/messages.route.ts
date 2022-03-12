import { Router } from 'express';
import MessagesController from '@controllers/messages.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateMessageDto, CreateThreadDto } from '@/dtos/messages.dto';

class MessagesRoute implements Routes {
  public path = '/messages';
  public router = Router();
  public messagesController = new MessagesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.messagesController.getThreads);

    this.router.get(`${this.path}/:id`, this.messagesController.getThread);

    this.router.post(`${this.path}/:id`, validationMiddleware(CreateMessageDto, 'body'), this.messagesController.createMessage);

    this.router.post(`${this.path}`, validationMiddleware(CreateThreadDto, 'body'), this.messagesController.createThread);
  }
}

export default MessagesRoute;
