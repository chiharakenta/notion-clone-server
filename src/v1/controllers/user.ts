import { AES } from 'crypto-js';
import { Handler, Request } from 'express';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY, TOKEN_SECRET_KEY } from '../constants/env';
import { UserModel, UserType } from '../models/user';

namespace userController {
  export const register: Handler = async (req: Request<any, any, UserType>, res) => {
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
  };

  // ユーザーログインAPI
}

export default userController;
