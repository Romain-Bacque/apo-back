const Core = require("./Core");
const debug = require("debug")("model");

class Category extends Core {
  #tag;

  static tableName = "category";

  constructor(config) {
    super(config);
    this.#tag = config.tag;
  }

  get tag() {
    return this.#tag;
  }
}

module.exports = Category;
