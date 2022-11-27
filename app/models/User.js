const client = require("../config/db");
const bcrypt = require("bcryptjs");
const Core = require("./Core");
const debug = require("debug")("model");

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

  static async getUserById(id) {
    const sqlString = `SELECT * FROM public.user WHERE id = $1;`;
    const values = [id];

    return (await client.query(sqlString, values)).rows[0];
  }

  static async getUserByEmail(email) {
    const sqlString = `SELECT * FROM public.user WHERE email = $1;`;
    const values = [email];

    return (await client.query(sqlString, values)).rows[0];
  }

  async register() {
    const query = {
      text: "INSERT INTO public.user (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *;",
      values: [this.name, this.email, this.password, this.role],
    };

    const result = await client.query(query);

    if (result.rowCount > 0) {
      return result.rows[0];
    } else return null;
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

    const result = await client.query(query);

    if (result.rowCount > 0) {
      return result.rows[0];
    } else return null;
  }

  static async updatePassword(id, hashedPassword) {
    const query = {
      text: "UPDATE public.user SET password = $2 WHERE id = $1 RETURNING *;",
      values: [id, hashedPassword],
    };

    const result = await client.query(query);

    return result.rowCount > 0;
  }

  static async deleteUser(id) {
    const query = {
      text: "DELETE FROM public.user WHERE id = $1 RETURNING *;",
      values: [id],
    };

    const result = await client.query(query);

    return result.rowCount > 0;
  }
}

module.exports = User;
