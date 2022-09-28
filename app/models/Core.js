class Core {
    #id;
    #created_at;
    #updated_at;

    static tableName = null;

    constructor(config) {
        this.id = config.id;
        this.created_at = config.created_at;
        this.updated_at = config.updated_at;
    };

    get id() {
        return this.#id;
    };

    get created_at() {
    return this.#created_at;
    };

    get updated_at() {
    return this.#updated_at;
    };
    
    static getAll() {
        const results = `SELECT * FROM ${this.tablename};`

        if(results.rows?.length > 0) {
            const list = [],
                rows = results.rows;

            for(const row of rows) {
                list.push(new this(row));
                return list;
            }
        } else return null;
    };
};

module.exports = Core;
