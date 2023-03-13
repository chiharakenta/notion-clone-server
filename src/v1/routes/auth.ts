import { Router } from 'express';
import { body } from 'express-validator';

import { UserModel } from '../models/user';
import { validate } from '../middlewares/validation';
import userController from '../controllers/user.controller';

export const router = Router();

// ユーザー新規登録API
router.post(
  '/register',
  body('username').isLength({ min: 8 }).withMessage('ユーザー名は8文字以上で入力してください。'),
  body('password').isLength({ min: 8 }).withMessage('パスワードは8文字以上で入力してください。'),
  body('confirmPassword')
    .isLength({ min: 8 })
    .withMessage('確認用パスワードは8文字以上で入力してください。'),
  body('username').custom((value) => {
    return UserModel.findOne({ username: value }).then((user) => {
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
