import { HttpException } from '@exceptions/HttpException';
import { Thread } from '@interfaces/threads.interface';
import threadModel from '@models/threads.model';
import { isEmpty } from '@utils/util';
import userService from '@services/users.service';

const projection = { _id: 1, admin: 1, user: 1, messages: 1 };

class MessageService {
  public threads = threadModel;
  public userService = new userService();

  public async findThreads(user: string, isAdmin: boolean): Promise<Thread[]> {
    let threads: Thread[] = [];

    if (isAdmin) {
      threads = await this.threads.find({ admin: user }, projection);
    } else {
      threads = await this.threads.find({ user: user }, projection);
    }

    return threads;
  }

  public async findThreadById(threadId: string): Promise<Thread> {
    if (isEmpty(threadId)) throw new HttpException(400, "You're not threadId");

    const thread: Thread = await this.threads.findById(threadId, projection);
    if (!thread) throw new HttpException(409, "You're not a thread");

    return thread;
  }

  public async createThread(admin: string, user: string): Promise<Thread> {
    let newThread = await this.threads.findOne({ admin, user }, projection);
    if (!newThread) newThread = await this.threads.create({ admin, user });

    return newThread;
  }

  public async createMessage(threadId: string, user: string, body: string): Promise<Thread> {
    const newThread = await this.threads.findByIdAndUpdate(
      threadId,
      {
        $push: { messages: { author: user, body: body, seen: false, createdAt: Date.now() } },
      },
      { returnDocument: 'after' },
    );

    return newThread;
  }

  public async setEmail(thread: Thread, isAdmin: boolean): Promise<Thread> {
    const user = await this.userService.findUserById(isAdmin ? thread.user : thread.admin);
    isAdmin ? (thread.user = user.email) : (thread.admin = user.email);

    return thread;
  }
}

export default MessageService;
