const bcrypt = require('bcryptjs');
const { User } = require('../models');
const localStrategy = require('passport-local').Strategy;

module.exports = async (passport) => {
    async function authenticate (email, password, done) {      
        try {            
            const user = await User.getUserByEmail(email);

            if (!user) return done(null, false);
            
            const hashPassword = await bcrypt.compare(password, user.password);
            
            if (hashPassword) {
                return done(null, user);
            } else {
                return done(null, false);
            }            
        } catch (err) {
            return done(err, false);
        }
    }
    
    // Create a new local strategy with Postgresql
    passport.use(new localStrategy({ usernameField: 'email', passwordField: 'password' }, authenticate));
        
    // serializeUser sets an id (the user email in this case) as the cookie in the user's browser, Passport takes that user id and stores it internally on req.session
    passport.serializeUser((user, done) => done(null, user.id));
        
    // deserializeUser function uses the id from the session (user email in this case) to look up the user in the database
    // and retrieve the user object with data, and attach it to req.user
    passport.deserializeUser(async (id, done) => {
        const user = await User.getUserById(id);

        return done(null, user);
    });
}
