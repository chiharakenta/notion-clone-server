import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send(process.env.PORT);
});

// ユーザー新規登録API

// ユーザーログインAPI

if ((process.env.NODE_ENV = 'production')) {
  app.listen(process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);
}

export const viteNodeApp = app;
