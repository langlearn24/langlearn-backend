import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import usersRouter from './routes/usersRouter.js';
import globalErrorHandler from './controllers/errorController.js';

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api/v1/users/', usersRouter);

app.use('*', (req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on the server`);
    err.statusCode = 404;
    err.status = 'fail';
    next(err)
})
app.use(globalErrorHandler);

export default app;