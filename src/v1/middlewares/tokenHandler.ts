import { PrismaClient } from '@prisma/client';
import { Handler } from 'express';
import { IncomingHttpHeaders } from 'http';
import { JwtPayload, verify } from 'jsonwebtoken';
import { TOKEN_SECRET_KEY } from '../constants/env';

const prisma = new PrismaClient();

// クライアントから渡されたJWTが正常か検証
export const tokenDecode = (accessToken: string) => {
  try {
    const decodedToken = verify(accessToken, TOKEN_SECRET_KEY) as JwtPayload;
    return decodedToken;
  } catch (error) {
    return false;
  }
};

// JWT認証を検証するためのミドルウェア
export const verifyToken: Handler = async (req, res, next) => {
  const accessToken = req.cookies.access_token as string;
  const decodedToken = tokenDecode(accessToken);
  if (!decodedToken) {
    return res.status(401).json('権限がありません。');
  }
  // そのJWTと一致するユーザーを探してくる
  const user = await prisma.user.findUnique({
    where: {
      id: decodedToken.id
    }
  });
  if (!user) {
    return res.status(401).json('権限がありません。');
  }

  // すべて通ったら次へ
  req.body.user = user;
  return next();
};
