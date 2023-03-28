import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import { CORS_ORIGIN, NODE_ENV, PORT } from './v1/constants/env';
import { router } from './v1/routes';
import cors from 'cors';

const app = express();
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v1', router);

if (NODE_ENV === 'production') {
  app.listen(PORT);
}

export const viteNodeApp = app;
