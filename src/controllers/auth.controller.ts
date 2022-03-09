import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import { UI_URL } from '@/config';
import AuthService from '@services/auth.service';
import UserService from '@/services/users.service';
import MailService from '@/services/mail.service';

class AuthController {
  public authService = new AuthService();
  public userService = new UserService();
  public mailService = new MailService();

  public getLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const user: User = await this.userService.createUser(userData);
      const token = this.authService.createToken(user);
      await this.mailService.send(user.email, 'Login Link', `${UI_URL}/login?token=${token}`);

      res.status(201).json({ data: user, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = this.authService.decodeToken(req.query.token);
      const user = await this.userService.findUserById(token._id);
      const cookie = this.authService.createCookie(req.query.token, token.exp);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: user, message: 'login' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
