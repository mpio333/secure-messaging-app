import { Request } from 'express';

export interface ReqWithUser extends Request {
  user: { _id: string; exp: string };
}
