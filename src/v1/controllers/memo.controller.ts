import { PrismaClient } from '@prisma/client';
import { Handler, Request } from 'express';
import { MemoType } from '../types/memo.type';
import { UserModel, VerifiedUser } from '../types/user.type';

const prisma = new PrismaClient();

export namespace memoController {
  export const getAll: Handler = async (req: Request<any, any, { user: VerifiedUser }>, res) => {
    const userId = req.body.user.id;
    try {
      const memos = await prisma.memo.findMany({
        where: {
          userId
        },
        orderBy: {
          position: 'asc'
        }
      });
      return res.status(200).json({ memos });
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  export const getOne = async (
    req: Request<{ memoId: string }, any, { user: VerifiedUser }>,
    res
  ) => {
    try {
      const memo = await prisma.memo.findUnique({
        where: {
          id: parseInt(req.params.memoId)
        }
      });
      if (!memo) {
        return res.status(404).json('メモが存在しません。');
      }
      if (memo.userId !== req.body.user.id) {
        return res.status(404).json('権限がありません。');
      }
      return res.status(200).json({ memo });
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  export const update = async (
    req: Request<
      { memoId: string },
      any,
      { user: VerifiedUser; title: MemoType['title']; description: MemoType['description'] }
    >,
    res
  ) => {
    try {
      const { user, title, description } = req.body;
      const memo = await prisma.memo.findUnique({
        where: {
          id: parseInt(req.params.memoId)
        }
      });
      if (!memo) {
        return res.status(404).json('メモが存在しません。');
      }
      if (memo.userId !== user.id) {
        return res.status(404).json('権限がありません。');
      }
      const updatedMemo = await prisma.memo.update({
        where: {
          id: parseInt(req.params.memoId)
        },
        data: {
          title: title || memo.title || '無題',
          description: description || memo.description || 'ここに自由に記入してください。'
        }
      });
      return res.status(200).json({ memo: updatedMemo });
    } catch (error) {
      return res.status(500).json(error);
    }
  };

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
