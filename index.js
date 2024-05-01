const express = require('express');
const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: "./config.env" });

const DB = process.env.DB_URL.replace('<password>', process.env.DB_PASS)
mongoose.connect(DB)
.then(() => console.log('DB connection is successful'))
.catch((err) => console.log('DB connection error: ', err))

app.listen(8000, 'localhost', () => {
    console.log('Server is up and running!')
});