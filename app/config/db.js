const debug = require('debug')('Database');
const { Client } = require("pg");
const database = process.env.PGDATABASE;

const client = new Client();
client.connect(err => {
    if (err) {
        debug('Connection error', err.stack)
    } else {
        debug(`Connected to database '${database}'`)
    }
});

module.exports = client;
