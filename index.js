require('dotenv').config();
const debug = require('debug')('server');
const express = require('express');

const port = process.env.PORT || 3000;
const app = express();

app.use(require('./app'));

app.listen(process.env.PORT || 3000)
