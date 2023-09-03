const debug = require("debug")("model");
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const Core = require("./Core");

class User extends Core {
  #name;
  #email;
  #password;
  #role;
  #isValid;

  static tableName = "user";

  constructor(config) {
    super(config);
    this.#name = config.name;
    this.#email = config.email;
    this.#password = config.password;
    this.#role = config.role;
    this.#isValid = config.isValid;
  }

  static async hashPassword(plainTextPassword) {
    return await bcrypt.hash(plainTextPassword, 10);
  }

  get name() {
    return this.#name;
  }

  get email() {
    return this.#email;
  }

  get password() {
    return this.#password;
  }

  get role() {
    return this.#role;
  }

  get isValid() {
    return this.#isValid;
  }

  static async getUserById(id) {
    const sqlString = `SELECT * FROM public.user WHERE id = $1;`;
    const values = [id];

    const result = await pool.query(sqlString, values);

    if (result.rowCount > 0) {
      return new User(result.rows[0]);
    } else {
      return null;
    }
  }

  static async getUserByEmail(email) {
    const sqlString = `SELECT * FROM public.user WHERE email = $1;`;
    const values = [email];

    const result = await pool.query(sqlString, values);

    if (result.rowCount > 0) {
      return new User(result.rows[0]);
    } else {
      return null;
    }
  }

  static findAndValidate = async function (password, email) {
    const sqlString = `SELECT * FROM public.user WHERE email = $1 AND "isValid" = 'true';`;
    const values = [email];

    const result = await pool.query(sqlString, values);

    if (result.rowCount <= 0) return false;

    const isValid = await bcrypt.compare(password, result.rows[0].password);

    return isValid ? new User(result.rows[0]) : false;
  };

  async register() {
    const query = {
      text: 'INSERT INTO public.user (name, email, password, role, "isValid") VALUES ($1, $2, $3, $4, $5) RETURNING *;',
      values: [this.name, this.email, this.password, this.role, this.isValid],
    };

    const result = await pool.query(query);

    if (result.rowCount > 0) {
      return new User(result.rows[0]);
    } else {
      return null;
    }
  }

  static async updateUser(id, name, email, hashedPassword) {
    const query = {
      text: `
        UPDATE public.user
        SET name = $2, email = $3, password = $4
        WHERE id = $1 RETURNING *;
      `,
      values: [id, name, email, hashedPassword],
    };

    const result = await pool.query(query);

    if (result.rowCount > 0) {
      return new User(result.rows[0]);
    } else {
      return null;
    }
  }

  static async updatePassword(id, hashedPassword) {
    const query = {
      text: "UPDATE public.user SET password = $2 WHERE id = $1 RETURNING *;",
      values: [id, hashedPassword],
    };

    const result = await pool.query(query);

    return result.rowCount > 0;
  }

  static async updateUserValidity(id, validity) {
    const query = {
      text: 'UPDATE public.user SET "isValid" = $2 WHERE id = $1 RETURNING *;',
      values: [id, validity],
    };

    const result = await pool.query(query);

    return result.rowCount > 0;
  }

  static async deleteUser(id) {
    const query = {
      text: "DELETE FROM public.user WHERE id = $1 RETURNING *;",
      values: [id],
    };

    const result = await pool.query(query);

    return result.rowCount > 0;
  }
}

module.exports = User;
