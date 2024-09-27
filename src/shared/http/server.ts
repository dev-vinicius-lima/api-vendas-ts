import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';
import AppError from '../errors/AppError';
import { AppDataSource } from 'src/shared/database/ormconfig';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

AppDataSource.initialize().then(() => {
  console.log('Database connected!');
  app.listen(3333, () => {
    console.log('Server is running! on Port: 3333 🔥️🔥️');
  });
});
