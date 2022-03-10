import { NextFunction, Request, Response } from 'express';
import { User } from '@interfaces/users.interface';
import userService from '@services/users.service';
import { HttpException } from '@/exceptions/HttpException';

class UsersController {
  public userService = new userService();

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as string;
      const isAdmin = await this.userService.isAdmin(user);
      if (!isAdmin) {
        throw new HttpException(401, "You're not an admin");
      }

      const users: User[] = await this.userService.findAllNormalUsers();
      res.status(200).json({ data: users, message: 'normalUsers' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
