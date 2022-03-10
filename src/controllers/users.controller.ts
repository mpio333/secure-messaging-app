import { NextFunction, Request, Response } from 'express';
import { User } from '@interfaces/users.interface';
import userService from '@services/users.service';

class UsersController {
  public userService = new userService();

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users: User[] = await this.userService.findAllNormalUsers();

      res.status(200).json({ data: users, message: 'normalUsers' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
