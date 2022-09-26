const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');

const passport = require('passport');
const passportLocal = require('passport-local').Strategy;


app.use(cookieParser("secretcode"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "keyboard cats",
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 60000
    }
}));

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(passport.initialize());
app.use(passport.session());

require('./config/passportConfig')(passport);

app.use(require('./routers'));

module.exports = app;
