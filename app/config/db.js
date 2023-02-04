require("dotenv").config();
const debug = require("debug")("database");
const { Pool } = require("pg");

const database = process.env.PGDATABASE;

// We create a "pool" of available connections and allow clients to share that pool, it's faster, because with "old" method (Client class),
// each query executed needs a connection to the SGBD, that takes time because an handshape is performed during this time laps (TCP 3 ways handshake, etc.).
const pool = new Pool();

pool.connect((err) => {
  if (err) {
    debug("connection error", err.stack);
  } else {
    debug(`connected to database '${database}'`);
  }
});

module.exports = pool;
