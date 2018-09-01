const path = require("path"),

    express = require("express"),
    bodyParser = require("body-parser"),

    config = require("./config"),

    app = express();

require("express-ws")(app);

const api = require("./api"),
    ws = require("./ws");

app.use(express.static("public", {index: "index.htm"}));
app.use(bodyParser.urlencoded({extended: true}));
app.use("/api", api);
app.use("/ws", ws);
app.use("/js/obs-websocket.js", (req, res) => {
    res.download(path.join(__dirname, "node_modules/obs-websocket-js/dist/obs-websocket.js"));
});

app.listen(config.express.port);
console.log(`Listening on port ${config.express.port}.`);

process.on("unhandledRejection", (err) => {
    console.log(err);
});
