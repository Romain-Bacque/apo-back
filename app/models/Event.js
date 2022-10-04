const client = require('../config/db');
const Core = require('./Core')
const debug = require('debug')('model');

class Event extends Core {
    #title;
    #description;
    #event_start;
    #brewery_id;

    static tableName = "event";

    constructor(config) {
        super(config);
        this.#title = config.title;
        this.#description = config.description;
        this.#event_start = config.event_start;
        this.#brewery_id = config.brewery_id;
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

    get brewery_id() {
        return this.#brewery_id;
    }

    async getEventsByOwner(id) { 
        const query = {
            text: `SELECT * FROM get_events_details($1)`,
            values: [id]   
        };
        
        const result = await client.query(query);

        if(result.rowCount > 0) {
            return result.rows;
        } else return null;      
    }

    async addEvent() {
        const query = {
            text: `INSERT INTO event (title, description, event_start, brewery_id)
                VALUES ($1, $2, $3, $4) ;`,
            values: [{
                title: this.#title,
                description: this.#description,
                event_start: this.#event_start,
                brewery_id: this.#brewery_id
            }]   
        };
        
        const result = await client.query(query);

        if(result.rowCount > 0) {
            return result.rows;
        } else return null;    
    }

    async deleteEvent(id) {
        const query = {
            text: `DELETE FROM public.event WHERE id = $1;
                DELETE FROM public.event WHERE id = $1;`,
            values: [id]   
        };
        
        const result = await client.query(query);

        if(result.rowCount > 0) {
            return result.rows;
        } else return null;     
    }

    async setParticipant(id) {
        const query = {
            text: "DELETE FROM public.event WHERE id = $1;",
            values: [id]   
        };
        
        const result = await client.query(query);

        if(result.rowCount > 0) {
            return result.rows;
        } else return null;     
    }

    async deleteParticipant(id) {
        const query = {
            text: "DELETE FROM public.event WHERE id = $1;",
            values: [id]   
        };
        
        const result = await client.query(query);

        if(result.rowCount > 0) {
            return result.rows;
        } else return null;     
    }
}

module.exports = Event;
