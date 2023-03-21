import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { NODE_ENV, PORT } from './v1/constants/env';
import { router } from './v1/routes';
import cors from 'cors';

const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000' // Fix: 本番用と開発用で使い分けられるように修正
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/v1', router);

if (NODE_ENV === 'production') {
  app.listen(PORT);
}

export const viteNodeApp = app;
