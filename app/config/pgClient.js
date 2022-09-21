const debug = require('debug')('SGBD');
const { Client } = require("pg");
const database = process.env.PGDATABASE;

const client = new Client();
client.connect(err => {
    if (err) {
        debug('connection error', err.stack)
    } else {
        debug(`connected to database'${database}'`)
    }
});

module.exports = client;