import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
dotenv.config();
import express, { Request } from 'express';
import { connect } from 'mongoose';
import { UserModel, UserType } from './v1/models/user';
import AES from 'crypto-js/aes';
import { MONGODB_URL, NODE_ENV, PORT, SECRET_KEY, TOKEN_SECRET_KEY } from './v1/constants/env';
import { sign } from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// DB接続
(async () => {
  connect(MONGODB_URL);
})().catch((error) => console.error(error));

// ユーザー新規登録API
app.post(
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
  (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }
    next();
  },
  async (req: Request<any, any, UserType>, res) => {
    try {
      const { username, password } = req.body;
      const encryptedPassword = AES.encrypt(password, SECRET_KEY);
      const user = await UserModel.create({ username, password: encryptedPassword });
      const token = sign({ id: user._id }, TOKEN_SECRET_KEY, {
        expiresIn: '24h'
      });
      return res.status(200).json({ user, token });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

// ユーザーログインAPI

if (NODE_ENV === 'production') {
  app.listen(PORT);
}

export const viteNodeApp = app;
