const config = require("./config"),
    express = require("express"),
    bodyParser = require("body-parser"),
    app = express();

require("express-ws")(app);

const api = require("./api"),
    ws = require("./ws");

app.use(express.static("public", {index: "index.htm"}));
app.use(bodyParser.urlencoded({extended: true}));
app.use("/api", api);
app.use("/ws", ws);

app.listen(config.express.port);
console.log(`Listening on port ${config.express.port}.`);

process.on("unhandledRejection", (err) => {
    console.log(err);
});
