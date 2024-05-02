const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const globalErrorHandler = require('./controllers/errorController');
const usersRouter = require('./routes/usersRouter')


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

module.exports = app;