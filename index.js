const dotenv = require('dotenv').config();
const express = require('express');

const app = express();

app.use(require('./app/routers/index'));

app.listen(process.env.PORT || 3000);
