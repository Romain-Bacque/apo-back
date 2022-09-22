const express = require('express');
const app = express();

// const cors = require('cors');
// app.use(cors({ origin: '*' }))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('./routers'));

module.exports = app;
