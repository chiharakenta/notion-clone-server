import { model, Schema } from 'mongoose';

export type UserType = {
  username: string;
  password: string;
};

const userSchema = new Schema<UserType>({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

export const UserModel = model<UserType>('User', userSchema);
