import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import { UI_URL } from '@/config';
import AuthService from '@services/auth.service';
import UserService from '@/services/users.service';
import MailService from '@/services/mail.service';
import { ReqWithUser } from '@/interfaces/request.interface';
import { JwtPayload } from 'jsonwebtoken';

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
      const token = req.query.token as string;
      const decodedToken = this.authService.decodeToken(token);
      const user = await this.userService.findUserById((decodedToken as JwtPayload)._id);
      res.status(200).cookie('token', token, { httpOnly: true }).json({ data: user, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).clearCookie('token').json({ message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  public session = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.findUserById(req.user._id);
      res.status(200).json({ data: user, message: 'session' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
