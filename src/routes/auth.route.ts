import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}get-link`, validationMiddleware(CreateUserDto, 'body'), this.authController.getLink);
    this.router.get(`${this.path}login`, this.authController.logIn);
    this.router.get(`${this.path}session`, this.authController.session);
    this.router.get(`${this.path}sign-out`, this.authController.logOut);
  }
}

export default AuthRoute;
