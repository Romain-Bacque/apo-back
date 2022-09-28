const Core = require('./Core')

class Brewery extends Core {
    #title;
    #phone;
    #description;
    #address;
    #image;
    #user_id;
        
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
}

module.exports = Brewery;
