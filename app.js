import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import authRouter from './routes/users/authRouter.js';
import usersRouter from './routes/users/usersRouter.js';
import learnersRouter from './routes/users/learnersRouter.js';
import tutorsRouter from './routes/users/tutorsRouter.js';
import addressesRouter from './routes/addressesRouter.js';
import postsRouter from './routes/posts/postsRouter.js';
import reactsRouter from './routes/posts/reactsRouter.js';
import globalErrorHandler from './controllers/global/errorController.js';
import AppError from './utils/appError.js';

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api/v1/auth/', authRouter);
app.use('/api/v1/users/', usersRouter);
app.use('/api/v1/learners/', learnersRouter);
app.use('/api/v1/tutors/', tutorsRouter);
app.use('/api/v1/addresses/', addressesRouter);
app.use('/api/v1/posts/', postsRouter);
app.use('/api/v1/reacts/', reactsRouter);

app.use('*', (req, res, next) => {
    const err = new AppError(`Can't find ${req.originalUrl} on the server`);
    err.statusCode = 404;
    err.status = 'fail';
    next(err)
})
app.use(globalErrorHandler);

export default app;