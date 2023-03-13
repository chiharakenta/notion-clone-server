import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { connect } from 'mongoose';
import { UserModel, UserType } from './v1/models/user';
import AES from 'crypto-js/aes';
import { MONGODB_URL, NODE_ENV, PORT, SECRET_KEY } from './v1/constants/env';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// DB接続
(async () => {
  connect(MONGODB_URL);
})().catch((error) => console.error(error));

// ユーザー新規登録API
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body as UserType;
    const encryptedPassword = AES.encrypt(password, SECRET_KEY);
    const user = await UserModel.create({ username, password: encryptedPassword });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.json(error);
  }
});

// ユーザーログインAPI

if (NODE_ENV === 'production') {
  app.listen(PORT);
}

export const viteNodeApp = app;
