import mongoose from 'mongoose';
import request from 'supertest';
import App from '../app';
import { CreateUserDto } from '../dtos/users.dto';
import AuthRoute from '../routes/auth.route';

describe('Testing Auth', () => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjI5MjExZjBhZTQyZWMyMDUxYmI1MDAiLCJpYXQiOjE2NDcxOTc1MTQsImV4cCI6MTY0NzgwMjMxNH0.FK8u97vrcwxVNvJf2_cu7mQrYAxvGbBH_tK4uEh2_Sc';
  const userData: CreateUserDto = {
    email: 'test@email.com',
  };
  const user = {
    _id: '60706478aad6c9ad19a31c84',
    email: userData.email,
    roles: ['admin'],
  };

  const authRoute = new AuthRoute();
  const users = authRoute.authController.userService;

  users.findUserById = jest.fn().mockReturnValue(user);

  (mongoose as any).connect = jest.fn();
  const app = new App([authRoute]);

  describe('[GET] /login', () => {
    it('response should have the Set-Cookie header with the token', async () => {
      const res = await request(app.getServer())
        .get(`${authRoute.path}login?token=${token}`)
        .send(userData)
        .expect('Set-Cookie', `token=${token}; Path=/; HttpOnly`);
      expect(res.status).toBe(200);
    });
  });

  describe('[GET] /session', () => {
    it('should verify the token', async () => {
      const res = await request(app.getServer())
        .get(`${authRoute.path}session`)
        .set('Cookie', [`token=${token}`])
        .send(userData);
      expect(res.status).toBe(200);
    });
  });

  describe('[GET] /sign-out', () => {
    it('should unset the cookie', async () => {
      const res = await request(app.getServer())
        .get(`${authRoute.path}sign-out`)
        .set('Cookie', [`token=${token}`])
        .send(userData)
        .expect('Set-Cookie', /^token=; /);
      expect(res.status).toBe(200);
    });
  });
});
