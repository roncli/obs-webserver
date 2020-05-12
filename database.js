const Db = require("node-database"),
    settings = require("./settings.js");

module.exports = new Db(settings.database);
