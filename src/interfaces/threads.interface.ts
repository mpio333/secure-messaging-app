import { Message } from '@interfaces/messages.interface';

export interface Thread {
  _id: string;
  admin: string;
  user: string;
  messages?: Message[];
}
