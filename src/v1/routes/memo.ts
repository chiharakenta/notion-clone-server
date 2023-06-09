import { Router } from 'express';
import { memoController } from '../controllers/memo.controller';
import { verifyToken } from '../middlewares/tokenHandler';

export const memoRouter = Router();

// メモを作成
memoRouter.post('/', verifyToken, memoController.create);

// ログイン中のユーザーが投稿したメモをすべて取得
memoRouter.get('/', verifyToken, memoController.getAll);

// ログイン中のユーザーが投稿したメモを1つ取得
memoRouter.get('/:memoId', verifyToken, memoController.getOne);

// ログイン中のユーザーが投稿したメモを複数更新
memoRouter.put('/position', verifyToken, memoController.updatePosition);

// ログイン中のユーザーが投稿したメモを更新
memoRouter.put('/:memoId', verifyToken, memoController.update);

// ログイン中のユーザーが投稿したメモを削除
memoRouter.delete('/:memoId', verifyToken, memoController.destroy);
