import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));


module.exports = app;