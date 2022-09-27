require('dotenv').config();
const debug = require('debug')('server');

const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.use(require('./app'));

app.listen(port, _ => {
    console.log(`connected to port ${port}`)
});
