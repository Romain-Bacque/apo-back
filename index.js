require('dotenv').config();
const debug = require('debug')('server');

const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.use(require('./app'));

app.listen(port, () => {
    debug(`Connected to port ${port}`)
});
