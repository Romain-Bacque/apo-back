const client = require('../config/db');
const bcrypt = require('bcryptjs');
const Core = require('./Core');
const debug = require('debug')('model');

class User extends Core {    
    #name;
    #email;
    #password;
    #role;
    
    static tableName = "user";

    constructor(config) {
        super(config);
        this.#name = config.name;
        this.#email = config.email;
        this.#password = config.password;
        this.#role = config.role;
    }

    static async hashPassword(plainTextPassword) {
        return await bcrypt.hash(plainTextPassword, 10);
    }

    get name () {
        return this.#name;
    }

    get email () {
        return this.#email;
    }

    get password () {
        return this.#password;
    }

    get role () {
        return this.#role;
    }

    static async getUserByEmail(email) {
        const sqlString = `SELECT * FROM public.user WHERE email = $1;`;
        const values = [email];

        return (await client.query(sqlString, values)).rows[0];
    }

    static async getUserById(id) {
        const sqlString = `SELECT * FROM public.user WHERE id = $1;`;
        const values = [id];

        return (await client.query(sqlString, values)).rows[0];
    }

    async register() {
        const query = {
            text: "INSERT INTO public.user (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *;",
            values: [this.name, this.email, this.password, this.role]   
        };
        
        const result = await client.query(query);
        
        if(result.rowCount > 0) {
            return result.rows[0];
        } else return null;
    }    
}

module.exports = User;
