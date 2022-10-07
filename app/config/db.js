const debug = require('debug')('database');
const { Client, Pool } = require("pg");

const client = new Pool({
    user: 'apo',
    host: 'localhost',
    database: 'apo',
    password: 'toto',
    port: 5432,
});

module.exports = client;
