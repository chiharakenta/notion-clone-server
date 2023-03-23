import { Router } from 'express';
import { memoController } from '../controllers/memo.controller';
import { verifyToken } from '../middlewares/tokenHandler';

export const memoRouter = Router();

// メモを作成
memoRouter.post('/', verifyToken, memoController.create);
