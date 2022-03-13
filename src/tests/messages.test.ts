import mongoose from 'mongoose';
import request from 'supertest';
import App from '../app';
import { CreateUserDto } from '../dtos/users.dto';
import MessagesRoute from '../routes/messages.route';

describe('Testing Messages', () => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjI5MjExZjBhZTQyZWMyMDUxYmI1MDAiLCJpYXQiOjE2NDcxOTc1MTQsImV4cCI6MTY0NzgwMjMxNH0.FK8u97vrcwxVNvJf2_cu7mQrYAxvGbBH_tK4uEh2_Sc';
  const userData: CreateUserDto = {
    email: 'test@email.com',
  };
  const user = {
    _id: '6229211f0ae42ec2051bb500',
    email: userData.email,
    roles: ['admin'],
  };
  const threadId = '60706478aad6c9ad19a31c85';
  const thread = { _id: threadId, admin: '6229211f0ae42ec2051bb500', user: '60706478aad6c9ad19a31c86', messages: [] };
  const threads = [thread];
  const anotherThreadId = '60706478aad6c9ad19a31c85';
  const anotherThread = { _id: anotherThreadId, admin: '6229211f0ae42ec2051bb501', user: '60706478aad6c9ad19a31c86', messages: [] };

  const messagesRoute = new MessagesRoute();
  const users = messagesRoute.messagesController.userService;
  const messages = messagesRoute.messagesController.messageService;

  users.findUserById = jest.fn().mockReturnValue(user);
  users.isAdmin = jest.fn().mockReturnValue(true);
  messages.findThreads = jest.fn().mockReturnValue(threads);
  messages.setMessagesSeen = jest.fn().mockReturnValue(thread);
  messages.setEmail = jest.fn().mockReturnValue(threads);
  messages.createThread = jest.fn().mockReturnValue(thread);

  (mongoose as any).connect = jest.fn();
  const app = new App([messagesRoute]);

  describe('[GET] /messages', () => {
    it('should return the users message threads', async () => {
      const res = await request(app.getServer())
        .get(messagesRoute.path)
        .set('Cookie', [`token=${token}`])
        .send(threads);
      expect(res.status).toBe(200);
    });
  });

  describe('[GET] /messages/:id', () => {
    it('should return the message thread', async () => {
      messages.findThreadById = jest.fn().mockReturnValue(thread);
      const res = await request(app.getServer())
        .get(`${messagesRoute.path}/${threadId}`)
        .set('Cookie', [`token=${token}`])
        .send(thread);
      expect(res.status).toBe(200);
    });

    it('should not return another users message thread', async () => {
      messages.findThreadById = jest.fn().mockReturnValue(anotherThread);
      const res = await request(app.getServer())
        .get(`${messagesRoute.path}/${anotherThreadId}`)
        .set('Cookie', [`token=${token}`])
        .send();
      expect(res.status).toBe(401);
    });
  });

  describe('[POST] /messages', () => {
    it('admin should create a new message thread', async () => {
      users.isAdmin = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false);
      const res = await request(app.getServer())
        .post(messagesRoute.path)
        .set('Cookie', [`token=${token}`])
        .send({ user: '123' });
      expect(res.status).toBe(200);
    });

    it('normal user should not create a new message thread', async () => {
      users.isAdmin = jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(false);
      const res = await request(app.getServer())
        .post(messagesRoute.path)
        .set('Cookie', [`token=${token}`])
        .send({ user: '123' });
      expect(res.status).toBe(401);
    });

    it('admin should not create a new message thread with anoither admin', async () => {
      users.isAdmin = jest.fn().mockReturnValue(true);
      const res = await request(app.getServer())
        .post(messagesRoute.path)
        .set('Cookie', [`token=${token}`])
        .send({ user: '123' });
      expect(res.status).toBe(401);
    });
  });
});
