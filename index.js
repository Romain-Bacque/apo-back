require("dotenv").config();
const debug = require("debug")("server");
const express = require("express");
const app = express();

// If process.env.PORT is falsy, then we use port 3000 as fallback
const port = process.env.PORT || 3000;

app.use(require("./app"));

// Listening port
app.listen(port, () => {
  debug(`Connected to port ${port}`);
});
