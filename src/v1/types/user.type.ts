import { MemoModel } from './memo.type';

export type UserType = {
  username: string;
  password: string;
};

export type UserModel = {
  id?: number;
  username: string;
  password: string;
  memos?: Array<MemoModel>;
};

export type VerifiedUser = {
  id: number;
  username: string;
  password: string;
};
