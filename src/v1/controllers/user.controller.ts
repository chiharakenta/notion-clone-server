import { PrismaClient } from '@prisma/client';
import { AES, enc } from 'crypto-js';
import { Handler, Request } from 'express';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY, TOKEN_SECRET_KEY } from '../constants/env';
import { UserType } from '../types/user.type';

const prisma = new PrismaClient();
namespace userController {
  export const register: Handler = async (req: Request<any, any, UserType>, res) => {
    try {
      const { username, password } = req.body;
      const encryptedPassword = AES.encrypt(password, SECRET_KEY).toString();
      const user = await prisma.user.create({
        data: {
          username,
          password: encryptedPassword
        }
      });
      const token = sign({ id: user.id }, TOKEN_SECRET_KEY, {
        expiresIn: '24h'
      });
      return res.status(201).json({ user, token });
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  // ユーザーログインAPI
  export const login: Handler = async (req: Request<any, any, UserType>, res) => {
    const { username, password } = req.body;
    try {
      // DBからユーザーが存在するか探してくる
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) {
        return res.status(401).json({
          errors: {
            param: 'username',
            message: 'ユーザー名が無効です。'
          }
        });
      }

      // パスワードが合っているか照合する
      const decryptedPassword = AES.decrypt(user.password, SECRET_KEY).toString(enc.Utf8);
      if (decryptedPassword !== password) {
        return res.status(401).json({
          errors: {
            param: 'password',
            message: 'パスワードが無効です。'
          }
        });
      }

      // JWTトークンを発行する
      const token = sign({ id: user.id }, TOKEN_SECRET_KEY, {
        expiresIn: '24h'
      });
      return res.status(201).json({ user, token });
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}

export default userController;
