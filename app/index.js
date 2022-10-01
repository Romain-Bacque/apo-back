const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
require('passport-local').Strategy;

// Activate the middleware to parse the cookie
app.use(cookieParser("secretcode"));
// Activate the middleware to parse the JSON payload
app.use(express.json());
// Activate the middleware to parse the urlencoded payload
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "keyboard cats",
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 60000
    }
}));

// Lift the CORS restriction
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(passport.initialize());
app.use(passport.session());

require('./config/passportConfig')(passport);

app.use(require('./routers'));

module.exports = app;
