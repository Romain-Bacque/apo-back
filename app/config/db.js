const debug = require('debug')('database');
const { Client, Pool } = require("pg");

const client = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: 5432,
});

module.exports = client;
