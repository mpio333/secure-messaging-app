import { NextFunction, Request, Response } from 'express';
import { Thread } from '@interfaces/threads.interface';
import userService from '@services/users.service';
import messageService from '@services/messages.service';
import { HttpException } from '@/exceptions/HttpException';

class MessagesController {
  public userService = new userService();
  public messageService = new messageService();

  public getThreads = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as string;
      const isAdmin = await this.userService.isAdmin(user);
      const threads: Thread[] = await this.messageService.findThreads(user, isAdmin);

      res.status(200).json({ data: threads, message: 'threads' });
    } catch (error) {
      next(error);
    }
  };

  public getThread = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const threadId: string = req.params.id;
      const thread: Thread = await this.messageService.findThreadById(threadId);

      if (thread.admin != user && thread.user != user) throw new HttpException(401, 'Not your conversation.');

      res.status(200).json({ data: thread, message: 'thread' });
    } catch (error) {
      next(error);
    }
  };

  public createThread = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = req.user as string;
      const isAdmin = await this.userService.isAdmin(admin);

      if (!isAdmin) {
        throw new HttpException(401, "You're not an admin");
      }

      const user = req.body.user;
      const userIsAdmin = await this.userService.isAdmin(user);

      if (userIsAdmin) {
        throw new HttpException(401, 'You cannot message another admin');
      }

      const thread: Thread = await this.messageService.createThread(admin, user);

      res.status(200).json({ data: thread, message: 'thread' });
    } catch (error) {
      next(error);
    }
  };

  public createMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as string;
      const threadId: string = req.params.id;
      const body = req.body.body;
      const thread: Thread = await this.messageService.findThreadById(threadId);

      if (thread.admin != user && thread.user != user) throw new HttpException(401, 'Not your conversation.');

      const updatedThread: Thread = await this.messageService.createMessage(threadId, user, body);

      res.status(200).json({ data: updatedThread, message: 'thread' });
    } catch (error) {
      next(error);
    }
  };
}

export default MessagesController;
