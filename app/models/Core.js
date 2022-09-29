class Core {
    #id;
    #created_at;
    #updated_at;

    static tableName = null;

    constructor(config) {
        this.#id = config.id;
        this.#created_at = config.created_at;
        this.#updated_at = config.updated_at;
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
    
    static async getAll() {
        let query;

        if(this.tableName === "brewery") {
            query = `SELECT * FROM get_${this.tableName};`;
        } else {
            query = `SELECT * FROM ${this.tableName};`;
        }

        const results = await client.query(query);

        if(results.rows && results.rows.length > 0) {
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
