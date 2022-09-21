const dotenv = require('dotenv').config();
const express = require('express');
const app = express();

app.use(require('./app/router'));

app.listen(process.env.PORT || 3000);