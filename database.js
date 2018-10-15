const Db = require("node-database"),
    config = require("./config.js");

module.exports = new Db(config.database);
