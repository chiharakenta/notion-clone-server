import { Router, Request } from 'express';
import { body } from 'express-validator';

import { UserType } from '../types/user.type';
import { validate } from '../middlewares/validation';
import userController from '../controllers/user.controller';
import { verifyToken } from '../middlewares/tokenHandler';
import { PrismaClient } from '@prisma/client';

export const router = Router();

const prisma = new PrismaClient();

// ユーザー新規登録API
router.post(
  '/register',
  body('username').isLength({ min: 8 }).withMessage('ユーザー名は8文字以上で入力してください。'),
  body('password').isLength({ min: 8 }).withMessage('パスワードは8文字以上で入力してください。'),
  body('confirmPassword')
    .isLength({ min: 8 })
    .withMessage('確認用パスワードは8文字以上で入力してください。'),
  body('username').custom((value) => {
    return prisma.user
      .findUnique({
        where: {
          username: value
        }
      })
      .then((user) => {
        if (user) return Promise.reject('このユーザー名は既に使われています。');
      });
  }),
  validate,
  userController.register
);

// ユーザーログインAPI
router.post(
  '/login',
  body('username').isLength({ min: 8 }).withMessage('ユーザー名は8文字以上で入力してください。'),
  body('password').isLength({ min: 8 }).withMessage('パスワードは8文字以上で入力してください。'),
  validate,
  userController.login
);

// JWT認証API
router.post('/verify-token', verifyToken, (req: Request<any, any, { user: UserType }>, res) => {
  return res.status(200).json({ user: req.body.user });
});