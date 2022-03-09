import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';

class AuthService {
  public createToken(user: User): string {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const expiresIn: number = 7 * 24 * 60 * 60;

    return sign(dataStoredInToken, SECRET_KEY, { expiresIn });
  }

  public decodeToken(token: string): string | JwtPayload {
    return verify(token, SECRET_KEY);
  }

  public createCookie(token: string, expiresIn: number): string {
    return `Authorization=${token}; HttpOnly; Max-Age=${expiresIn};`;
  }
}

export default AuthService;
