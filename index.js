const config = require("./config"),
    express = require("express"),
    bodyParser = require("body-parser"),
    api = require("./api"),
    app = express();

app.use(express.static("public", {index: "index.htm"}));
app.use(bodyParser.urlencoded({extended: true}));
app.use("/api", api);

app.listen(config.express.port);
console.log(`Listening on port ${config.express.port}.`);

process.on("unhandledRejection", (err) => {
    console.log(err);
});
