const debug = require("debug")("model");
const pool = require("../config/db");
const Core = require("./Core");

class Event extends Core {
  #title;
  #description;
  #event_start;
  #brewery;
  #participants;
  #total_participants;
  #breweryId;
  #ownerId;

  static tableName = "event";

  constructor(config) {
    super(config);
    this.#title = config.title;
    this.#description = config.description;
    this.#event_start = config.event_start;
    this.#brewery = config.brewery;
    this.#participants = config.participants;
    this.#total_participants = config.total_participants;
    this.#breweryId = config.breweryId;
    this.#ownerId = config.ownerId;
  }

  get title() {
    return this.#title;
  }

  get description() {
    return this.#description;
  }

  get event_start() {
    return this.#event_start;
  }

  get brewery() {
    return this.#brewery;
  }

  get participants() {
    return this.#participants;
  }

  get total_participants() {
    return this.#total_participants;
  }

  get breweryId() {
    return this.#breweryId;
  }

  get ownerId() {
    return this.#ownerId;
  }

  static async getEventsByOwner(id) {
    const query = {
      text: `SELECT * FROM public.get_events_by_owner($1);`,
      values: [id],
    };

    const result = await pool.query(query);

    if (result.rowCount > 0) {
      return result.rows.map((row) => new Event(row));
    } else return null;
  }

  static async getEventsByParticipant(id) {
    const query = {
      text: `SELECT * FROM public.get_events_by_participant($1);`,
      values: [id],
    };

    const result = await pool.query(query);

    if (result.rowCount > 0) {
      return result.rows.map((row) => new Event(row));
    } else return null;
  }

  static async getEventsByBrewery(id) {
    const query = {
      text: `SELECT * FROM public.get_brewery_events($1);`,
      values: [id],
    };

    const result = await pool.query(query);

    if (result.rowCount > 0) {
      return result.rows.map((row) => new Event(row));
    } else return null;
  }
  async addEvent() {
    const query = {
      text: `SELECT * FROM public.insert_event($1);`,
      values: [
        {
          title: this.title,
          description: this.description,
          event_start: this.event_start,
          breweryId: this.breweryId,
          ownerId: this.ownerId,
        },
      ],
    };

    const result = await pool.query(query);

    if (result.rowCount > 0) {
      return result.rows.map((row) => new Event(row));
    } else return null;
  }

  static async deleteEvent(id) {
    const query = {
      text: `DELETE FROM public.event WHERE id = $1 RETURNING *;`,
      values: [id],
    };

    const result = await pool.query(query);

    return result.rowCount > 0;
  }

  static async setParticipant(userId, eventId) {
    const query = {
      text: "SELECT * FROM set_participant($1, $2);",
      values: [userId, eventId],
    };
    const result = await pool.query(query);

    if (result.rowCount > 0) {
      return result.rows[0]; // return a message
    } else return null;
  }

  static async deleteParticipant(userId, eventId) {
    const query = {
      text: "DELETE FROM public.participate WHERE user_id = $1 AND event_id = $2 RETURNING *;",
      values: [userId, eventId],
    };
    const result = await pool.query(query);

    return result.rowCount > 0;
  }
}

module.exports = Event;
