import { model, Schema, Document } from 'mongoose';
import { Thread } from '@interfaces/threads.interface';

const messageSchema: Schema = new Schema({
  author: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  seen: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Number,
    required: true,
  },
});

const threadSchema: Schema = new Schema({
  admin: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  messages: [
    {
      type: messageSchema,
    },
  ],
});

const threadModel = model<Thread & Document>('Thread', threadSchema);

export default threadModel;
