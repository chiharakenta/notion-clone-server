import { UserModel } from './user.type';

export type MemoModel = {
  id?: number;
  icon?: string;
  title?: string;
  description?: string;
  position: number;
  favorite?: boolean;
  favoritePosition?: number;
  user?: UserModel;
  userId: number;
};

export type MemoType = {
  id: number;
  icon: string;
  title: string;
  description: string;
  position: number;
  favorite: boolean;
  favoritePosition: number;
  user: UserModel;
  userId: number;
};
