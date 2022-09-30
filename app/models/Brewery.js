const Core = require('./Core')

class Brewery extends Core {
    #title;
    #phone;
    #description;
    #address;
    #image;
    #user_id;
    #categories;
        
    static tableName = "brewery";

    constructor(config) {
        super(config);
        this.#title = config.title;
        this.#phone = config.phone;
        this.#description = config.description;
        this.#image = config.image;
        this.#user_id = config.user_id;
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

    async addBrewery() {
        const query = {
            text: "INSERT INTO public.brewery (title, phone, description, image, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
            values: [this.title, this.phone, this.description, this.image, this.user_id, this.categories]   
        };
        
        const result = await client.query(query);
        
        if(result.rowCount > 0) {
            return result.rows[0];
        } else return null;    
    }

    async updateBrewery(id) {
        const query = {
            text: `UPDATE public.brewery SET (title = $1, phone = $2, description = $3, image = $4, user_id = $5) WHERE id = ${id};`,
            values: [this.title, this.phone, this.description, this.image, this.user_id]   
        };
        
        const result = await client.query(query);
        
        if(result.rowCount > 0) {
            return result.rows[0];
        } else return null;    
    }

    static async deleteBrewery(id) {
        const result = await client.query(`DELETE * FROM public.brewery WHERE id = ${id};`);
        
        if(result.rowCount > 0) {
            return result.rows[0];
        } else return null;    
    }
}

module.exports = Brewery;
