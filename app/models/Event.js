const client = require("../config/db");
const Core = require("./Core");
const debug = require("debug")("model");

class Event extends Core {
  #title;
  #description;
  #eventStart;
  #breweryId;

  static tableName = "event";

  constructor(config) {
    super(config);
    this.#title = config.title;
    this.#description = config.description;
    this.#eventStart = config.eventStart;
    this.#breweryId = config.breweryId;
  }

  get title() {
    return this.#title;
  }

  get description() {
    return this.#description;
  }

  get eventStart() {
    return this.#eventStart;
  }

  get breweryId() {
    return this.#breweryId;
  }

  static async getEventsByParticipant(id) {
    const query = {
      text: `SELECT * FROM public.get_events_details($1);`,
      values: [id],
    };

    const result = await client.query(query);

    if (result.rowCount > 0) {
      return result.rows;
    } else return null;
  }

  static async getEventsByBrewery(id) {
    const query = {
      text: `SELECT * FROM public.get_brewery_events($1);`,
      values: [id],
    };

    const result = await client.query(query);

    if (result.rowCount > 0) {
      return result.rows;
    } else return null;
  }

  async addEvent() {
    const query = {
      text: `INSERT INTO event (title, description, event_start, brewery_id)
                VALUES ($1, $2, $3, $4) RETURNING *;`,
      values: [
        this.#title,
        this.#description,
        this.#eventStart,
        this.#breweryId,
      ],
    };
    const result = await client.query(query);

    if (result.rowCount > 0) {
      return result.rows[0];
    } else return null;
  }

  static async deleteEvent(id) {
    const query = {
      text: `DELETE FROM public.participate WHERE event_id = $1;
                DELETE FROM public.event WHERE id = $1 RETURNING *;`,
      values: [id],
    };

    const result = await client.query(query);

    if (result.rowCount > 0) {
      return true;
    } else return false;
  }

  static async setParticipant(userId, eventId) {
    const query = {
      text: "SELECT * FROM set_participant($1, $2);",
      values: [userId, eventId],
    };

    const result = await client.query(query);

    if (result.rowCount > 0) {
      return result.rows[0];
    } else return null;
  }

  static async deleteParticipant(userId, eventId) {
    const query = {
      text: "DELETE FROM public.participate WHERE user_id = $1 AND event_id = $2 RETURNING *;",
      values: [userId, eventId],
    };
    const result = await client.query(query);

    return result.rowCount > 0;
  }
}

module.exports = Event;
