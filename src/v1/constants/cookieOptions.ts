import { CookieOptions } from 'express';
import { NODE_ENV } from './env';

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === 'production',
  sameSite: 'none'
};
