const pool = require("../config/db");
const debug = require("debug")("model");

class Core {
  #id;
  #created_at;
  #updated_at;

  static tableName = null;

  constructor(config) {
    this.#id = config.id;
    this.#created_at = config.created_at;
    this.#updated_at = config.updated_at;
  }

  get id() {
    return this.#id;
  }

  get created_at() {
    return this.#created_at;
  }

  get updated_at() {
    return this.#updated_at;
  }

  static async getAll(id) {
    let query;

    if (this.tableName === "brewery") {
      query = `SELECT * FROM public.brewery_records;`;
    } else if (this.tableName === "event") {
      query = {
        text: `SELECT * FROM public.get_events_details($1);`,
        values: [id],
      };
    } else {
      query = `SELECT * FROM public.${this.tableName};`;
    }

    const results = await pool.query(query);

    if (results.rows?.length) {
      const list = [],
        rows = results.rows;

      for (const row of rows) {
        list.push(new this(row));
      }

      return list;
    } else return null;
  }
}

module.exports = Core;
