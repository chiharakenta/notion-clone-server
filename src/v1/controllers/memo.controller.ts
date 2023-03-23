import { PrismaClient } from '@prisma/client';
import { Handler, Request } from 'express';
import { VerifiedUser } from '../types/user.type';

const prisma = new PrismaClient();

export namespace memoController {
  export const create: Handler = async (req: Request<any, any, { user: VerifiedUser }>, res) => {
    try {
      const userId = req.body.user.id;
      const memoCount = (
        await prisma.memo.findMany({
          where: {
            userId
          }
        })
      ).length;
      // メモ新規作成
      const memo = await prisma.memo.create({
        data: {
          userId,
          position: memoCount ? memoCount : 0
        }
      });
      return res.status(200).json({ memo });
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}
