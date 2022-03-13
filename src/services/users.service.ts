import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import { roles } from '@/utils/constants';

const projection = { _id: 1, email: 1, roles: 1 };

class UserService {
  public users = userModel;

  public async findAllNormalUsers(): Promise<User[]> {
    const users: User[] = await this.users.find({ roles: [] }, projection);
    return users;
  }

  public async findUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const findUser: User = await this.users.findById(userId, projection);
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    const roles = userData.roles || [];
    let newUser = await this.users.findOne({ email: userData.email }, projection);
    if (!newUser) newUser = await this.users.create({ email: userData.email, roles: roles });

    return newUser;
  }

  public async isAdmin(userId: string): Promise<boolean> {
    const user: User = await this.findUserById(userId);
    return user.roles.includes(roles.ADMIN);
  }
}

export default UserService;
