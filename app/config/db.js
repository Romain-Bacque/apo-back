const debug = require('debug')('database');
const { Client, Pool } = require("pg");
const database = process.env.PGDATABASE;

const client = new Pool();

client.connect(err => {
    if (err) {
        debug('Connection error', err.stack);
    } else {
        debug(`Connected to database '${database}'`);
    }
});

module.exports = client;
