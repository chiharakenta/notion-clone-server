import { PrismaClient } from '@prisma/client';
import { Handler, Request } from 'express';
import { MemoType } from '../types/memo.type';
import { VerifiedUser } from '../types/user.type';

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

  export const update = async (
    req: Request<
      { memoId: string },
      any,
      {
        user: VerifiedUser;
        title: MemoType['title'];
        description: MemoType['description'];
        icon: MemoType['icon'];
      }
    >,
    res
  ) => {
    try {
      const { user, title, description, icon } = req.body;
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
          description: description || memo.description || 'ここに自由に記入してください。',
          icon: icon || memo.icon
        }
      });
      return res.status(200).json({ memo: updatedMemo });
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  export const updatePosition = async (
    req: Request<
      any,
      any,
      {
        user: VerifiedUser;
        memos: [MemoType, MemoType];
      }
    >,
    res
  ) => {
    try {
      const { user, memos } = req.body;
      const targetMemos = await prisma.memo.findMany({
        where: {
          OR: [
            {
              userId: user.id,
              id: memos[0].id
            },
            {
              userId: user.id,
              id: memos[1].id
            }
          ]
        }
      });
      if (targetMemos.length < 2) {
        return res.status(404).json({
          message: '更新対象のメモが２つ見つかりません。',
          memos: targetMemos
        });
      }

      await prisma.$transaction(
        memos.map((memo) =>
          prisma.memo.update({
            where: {
              id: memo.id
            },
            data: {
              position: memo.position
            }
          })
        )
      );
      const sortedMemo = await prisma.memo.findMany({
        where: { userId: user.id },
        orderBy: { position: 'asc' }
      });
      return res.status(200).json({ memos: sortedMemo });
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  export const destroy = async (
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
      await prisma.memo.delete({
        where: {
          id: parseInt(req.params.memoId)
        }
      });
      return res.status(200).json('メモを削除しました。');
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}
