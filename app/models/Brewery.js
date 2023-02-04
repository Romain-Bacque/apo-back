const debug = require("debug")("model");
const pool = require("../config/db");
const Core = require("./Core");

class Brewery extends Core {
  #title;
  #phone;
  #description;
  #address;
  #lat;
  #lon;
  #image;
  #user_id;
  #categories;
  #events;

  static tableName = "brewery";

  constructor(config) {
    super(config);
    this.#title = config.title;
    this.#phone = config.phone;
    this.#description = config.description;
    this.#address = config.address;
    this.#lat = config.lat;
    this.#lon = config.lon;
    this.#image = config.image;
    this.#user_id = config.user_id;
    this.#categories = config.categories;
    this.#events = config.events;
  }

  get title() {
    return this.#title;
  }

  get phone() {
    return this.#phone;
  }

  get description() {
    return this.#description;
  }

  get address() {
    return this.#address;
  }

  get lat() {
    return this.#lat;
  }

  get lon() {
    return this.#lon;
  }

  get image() {
    return this.#image;
  }

  get user_id() {
    return this.#user_id;
  }

  get categories() {
    return this.#categories;
  }

  get events() {
    return this.#events;
  }

  static async getBreweryById(id) {
    const results = await pool.query(
      `SELECT * FROM public.get_brewery_details(${id});`
    );

    if (results.rowCount > 0) {
      const list = [],
        row = results.rows[0];

      list.push(new this(row));

      return list;
    } else return null;
  }

  async addBrewery() {
    const query = {
      text: "SELECT * FROM public.insert_brewery($1);",
      values: [
        {
          title: this.title,
          phone: this.phone,
          description: this.description,
          address: this.address,
          lat: this.lat,
          lon: this.lon,
          image: this.image,
          user_id: this.user_id,
          categories: this.categories,
        },
      ],
    };

    const result = await pool.query(query);

    if (result.rowCount > 0) {
      return result.rows;
    } else return null;
  }

  async updateBrewery() {
    const query = {
      text: `SELECT * FROM public.update_brewery($1);`,
      values: [
        {
          id: this.id,
          title: this.title,
          phone: this.phone,
          description: this.description,
          address: this.address,
          lat: this.lat,
          lon: this.lon,
          image: this.image,
          user_id: this.user_id,
          categories: this.categories,
        },
      ],
    };

    const result = await pool.query(query);

    if (result.rowCount > 0) {
      return result.rows;
    } else return null;
  }

  static async deleteBrewery(id) {
    const query = {
      text: "SELECT * FROM public.delete_brewery($1);",
      values: [id],
    };
    const result = await pool.query(query);

    if (result.rowCount > 0) {
      return result.rows;
    } else return null;
  }
}

module.exports = Brewery;
