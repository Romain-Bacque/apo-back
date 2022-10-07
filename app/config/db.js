const debug = require('debug')('database');
const { Pool } = require("pg");

const client = new Pool({
    user: 'apo',
    host: 'localhost',
    database: 'apo',
    password: 'pass',
    port: 5432,
});

module.exports = client;
