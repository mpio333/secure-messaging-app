import { NextFunction, Response } from 'express';
import { Thread } from '@interfaces/threads.interface';
import userService from '@services/users.service';
import messageService from '@services/messages.service';
import mailService from '@services/mail.service';
import { HttpException } from '@/exceptions/HttpException';
import { UI_URL } from '@/config';
import { ReqWithUser } from '@/interfaces/request.interface';

class MessagesController {
  public userService = new userService();
  public messageService = new messageService();
  public mailService = new mailService();

  public getThreads = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const isAdmin = await this.userService.isAdmin(user._id);
      const threads: Thread[] = await this.messageService.findThreads(user._id, isAdmin);

      for (let thread of threads) {
        thread = await this.messageService.setEmail(thread, isAdmin);
      }

      res.status(200).json({ data: threads, message: 'threads' });
    } catch (error) {
      next(error);
    }
  };

  public getThread = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user._id;
      const isAdmin = await this.userService.isAdmin(user);
      const threadId: string = req.params.id;
      let thread: Thread = await this.messageService.findThreadById(threadId);

      if (thread.admin != user && thread.user != user) throw new HttpException(401, 'Not your conversation.');

      thread = await this.messageService.setMessagesSeen(threadId, user);
      thread = await this.messageService.setEmail(thread, isAdmin);

      res.status(200).json({ data: thread, message: 'thread' });
    } catch (error) {
      next(error);
    }
  };

  public createThread = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
      const admin = req.user._id;
      const isAdmin = await this.userService.isAdmin(admin);

      if (!isAdmin) {
        throw new HttpException(401, "You're not an admin");
      }

      const user = req.body.user;
      const userIsAdmin = await this.userService.isAdmin(user);

      if (userIsAdmin) {
        throw new HttpException(401, 'You cannot message another admin');
      }

      let thread: Thread = await this.messageService.createThread(admin, user);
      thread = await this.messageService.setEmail(thread, isAdmin);

      res.status(200).json({ data: thread, message: 'thread' });
    } catch (error) {
      next(error);
    }
  };

  public createMessage = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user._id;
      const isAdmin = await this.userService.isAdmin(user);
      const threadId: string = req.params.id;
      const body = req.body.body;
      const thread: Thread = await this.messageService.findThreadById(threadId);

      if (thread.admin != user && thread.user != user) throw new HttpException(401, 'Not your conversation.');

      let updatedThread: Thread = await this.messageService.createMessage(threadId, user, body);
      updatedThread = await this.messageService.setEmail(updatedThread, isAdmin);

      const recipient = await this.userService.findUserById(isAdmin ? thread.user : thread.admin);
      this.mailService.send(recipient.email, 'New Message', `New message: ${UI_URL}/chat?id=${threadId}`);

      res.status(200).json({ data: updatedThread, message: 'thread' });
    } catch (error) {
      next(error);
    }
  };
}

export default MessagesController;
