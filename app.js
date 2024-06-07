import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import authRouter from './routes/users/authRouter.js';
import usersRouter from './routes/users/usersRouter.js';
import learnersRouter from './routes/users/learnersRouter.js';
import tutorsRouter from './routes/users/tutorsRouter.js';
import addressesRouter from './routes/addressesRouter.js';
import postsRouter from './routes/hub/postsRouter.js';
import commentsRouter from './routes/hub/commentsRouter.js';
import repliesRouter from './routes/hub/repliesRouter.js';
import reactsRouter from './routes/hub/reactsRouter.js';
import globalErrorHandler from './controllers/global/errorController.js';
import AppError from './utils/appError.js';
import { protect } from './controllers/users/authController.js';

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api/v1/auth/', authRouter);
app.use('/api/v1/users/', protect, usersRouter);
app.use('/api/v1/learners/', protect, learnersRouter);
app.use('/api/v1/tutors/', protect, tutorsRouter);
app.use('/api/v1/addresses/', protect, addressesRouter);
app.use('/api/v1/posts/', protect, postsRouter);
app.use('/api/v1/comments/', protect, commentsRouter);
app.use('/api/v1/replies/', protect, repliesRouter);
app.use('/api/v1/reacts/', protect, reactsRouter);

app.use('*', (req, res, next) => {
    const err = new AppError(`Can't find ${req.originalUrl} on the server`);
    err.statusCode = 404;
    err.status = 'fail';
    next(err)
})
app.use(globalErrorHandler);

export default app;