const bcrypt = require('bcryptjs');
const client = require('./db');
const localStrategy = require('passport-local').Strategy;

module.exports = async (passport) => {
    async function getUserByEmail(email) {
        const sqlString = `SELECT * FROM public.user WHERE email = $1;`;
        const values = [email];

        const user = (await client.query(sqlString, values)).rows[0];
<<<<<<< HEAD

        return user;
    }

=======

        return user;
    }

>>>>>>> 1ec7f4ef3c8d726dede4428ae40074a8bb67d3c2
    async function authenticate (email, password, done) {      
        try {            
            const user = await getUserByEmail(email);

            if (!user && !user.length) return done(null, false);
            
            const hashPassword = await bcrypt.compare(password, user.password);
            
            if (hashPassword) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
            
        } catch(err) {
            return done(err, false);
        }
    }
}
    
    // Create a new local strategy with Postgresql
    passport.use(new localStrategy({ usernameField: 'email', passwordField: 'password' }, authenticate));
        
    // serializeUser sets an id (the user email in this case) as the cookie in the user's browser, Passport takes that user id and stores it internally on req.session
    passport.serializeUser((user, done) => done(null, user.email));
        
    // deserializeUser function uses the id from the session (user email in this case) to look up the user in the database and retrieve the user object with data, and attach it to req.user
    passport.deserializeUser((email, done) => done(null, email));
<<<<<<< HEAD

}
=======
>>>>>>> 1ec7f4ef3c8d726dede4428ae40074a8bb67d3c2
