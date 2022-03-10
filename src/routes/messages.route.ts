import { Router } from 'express';
import MessagesController from '@controllers/messages.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import passport from '@utils/passport';
import { CreateMessageDto, CreateThreadDto } from '@/dtos/messages.dto';

class MessagesRoute implements Routes {
  public path = '/messages';
  public router = Router();
  public messagesController = new MessagesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, passport.authenticate('jwt', { session: false }), this.messagesController.getThreads);

    this.router.get(`${this.path}/:id`, passport.authenticate('jwt', { session: false }), this.messagesController.getThread);

    this.router.post(
      `${this.path}/:id`,
      passport.authenticate('jwt', { session: false }),
      validationMiddleware(CreateMessageDto, 'body'),
      this.messagesController.createMessage,
    );

    this.router.post(
      `${this.path}`,
      passport.authenticate('jwt', { session: false }),
      validationMiddleware(CreateThreadDto, 'body'),
      this.messagesController.createThread,
    );
  }
}

export default MessagesRoute;
