const client = require('../config/db');
const Core = require('./Core')
const debug = require('debug')('model');

class Brewery extends Core {
    #title;
    #phone;
    #description;
    #address;
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
        this.#image = config.image;
        this.#user_id = config.user_id;
        this.#categories = config.categories;
        this.#events = config.events;
    }

    get title () {
        return this.#title;
    }

    get phone () {
        return this.#phone;
    }

    get description () {
        return this.#description;
    }

    get address () {
        return this.#address;
    }

    get image () {
        return this.#image;
    }

    get user_id () {
        return this.#user_id;
    }

    get categories () {
        return this.#categories;
    }

    get events () {
        return this.#events;
    }
    static async getBreweriesByUser(id) {
        const query = {
            text: 'SELECT * FROM public.get_user_breweries($1);',
            values: [id],
        };
        const results = await client.query(query);

        if(results.rows?.length) {
            const list = [],
            rows = results.rows;

            for(const row of rows) {
                list.push(new this(row));
            }

            return list;
        } else return null;
    };

    static async getBreweryById(id) {    
        const results = await client.query(`SELECT * FROM public.get_brewery_details(${id});`);

        if(results.rows?.length) {
            const list = [],
            rows = results.rows;

            for(const row of rows) {
                list.push(new this(row));
            }

            return list;
        } else return null;  
    }

    async addBrewery() {
        const query = {
            text: "SELECT * FROM insert_brewery($1);",
            values: [{
                title: this.title,
                phone: this.phone,
                description: this.description,
                address: this.address,
                image: this.image,
                user_id: this.user_id,
                categories: this.categories
            }]   
        };
        
        const result = await client.query(query);

        if(result.rowCount > 0) {
            return result.rows;
        } else return null;    
    }

    async updateBrewery(id) {
        const query = {
            text: `SELECT * FROM update_brewery($1);`,
            values: [{
                id,
                title: this.title,
                phone: this.phone,
                description: this.description,
                address: this.address,
                image: this.image,
                user_id: this.user_id,
                categories: this.categories
            }]   
        };
        
        const result = await client.query(query);
        
        if(result.rowCount > 0) {
            return result.rows[0];
        } else return null;    
    }

    static async deleteBrewery(id) {
        const query = {
            text: 'DELETE FROM public.brewery WHERE id = $1 RETURNING *;',
            values: [id],
        };
        const result = await client.query(query);

        return result.rowCount > 0;
    }
}

module.exports = Brewery;
