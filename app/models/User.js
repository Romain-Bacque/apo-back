const Client = require('../config/db');
const bcrypt = require('bcryptjs');
const Core = require('./Core');

class User extends Core {    
    #name;
    #email;
    #password;
    #role;
    
    static tableName = "user";

    constructor(config) {
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

    async register() {
        const query = "INSERT INTO user (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *;";
        const values = [{ name: this.name, email: this.email, password: this.password, role: this.role }];        

        const result = await Client.query(query, values);

        if(result.rowCount > 0) {
            return result;
        } else return null;
    }    
}

module.exports = User;
