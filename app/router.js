const express = require('express');
const router = express.Router();

const reqLogger = require('./middlewares/reqLogger');

router.get('/', reqLogger, (req, res, next) => require('./controllers/home')(req, res, next));

module.exports = router;
