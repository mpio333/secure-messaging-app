import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  roles: {
    type: Array,
    required: true,
  },
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
