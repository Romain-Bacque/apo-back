const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
require('passport-local').Strategy;


// SWAGGER

const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const port = process.env.PORT || 3000;
const domain = process.env.DOMAIN || 'localhost';

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Bières de ta région",
            version: "1.0.0",
            description: "API that handle data for 'Bières de ta région' app"
        },    
        servers: [
            {
                url: `http://${domain}:${port}`,
                description: "My API Documentation"
            },
        ],
    },
    apis: ["./app/routers/*.js"],
};

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));


// EXPRESS

// Activate the middleware to parse the cookie
app.use(cookieParser("secretcode"));
// Activate the middleware to parse the JSON payload
app.use(express.json());
// Activate the middleware to parse the urlencoded payload
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "keyboard cats", // default name for more security
    resave: true, // resave session even if there is no change
    saveUninitialized: true, // don't create session until something is stored
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 60000
    }
}));

// Lift the CORS restriction
app.use(cors({
    origin: `*`,
    credentials: true
}));

app.use(passport.initialize());
app.use(passport.session());

require('./config/passportConfig')(passport);

app.use(require('./routers'));

module.exports = app;
