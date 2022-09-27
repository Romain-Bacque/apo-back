//const Users = require('./users'); // User model
const bcrypt = require('bcryptjs');
const client = require('./db');
const localStrategy = require('passport-local').Strategy;

module.exports = async (passport) => {

// comment

    async function authenticate (email, password, done){

        const sqlString = `SELECT * FROM user WHERE email = $1;`;
        const values = [email];
        
        try {

            const query = await client.query(sqlString, values);
            if (!query?.rows[0]) return done(null, false);

            const hashPassword = await bcrypt.compare(password, query.rows[0].password);

            if (hashPassword) {
                return done(null, query.rows[0]);
            }
            else {
                return done(null, false);
            }
            
        } catch (err) {
            return done(err, false);
        }
    }
    
    passport.use(new localStrategy({ usernameField: 'email', passwordField: 'password' }, authenticate));

    passport.serializeUser((user, done) => {
        done(null, user.email);
    });

    passport.deserializeUser((id, done) => {
        Users.findOne({ _id: id }, (err, user) => {
            done(err, user);
        })
    });

}