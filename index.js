const path = require("path"),

    express = require("express"),
    bodyParser = require("body-parser"),

    settings = require("./settings"),

    app = express();

require("express-ws")(app);

const api = require("./api"),
    ws = require("./ws");

require("./database");

if (process.platform === "win32") {
    process.title = "roncli Gaming Webserver";
} else {
    process.stdout.write("\x1b]2;roncli Gaming Webserver\x1b\x5c");
}

app.use(express.static("public", {index: "index.htm"}));
app.use(bodyParser.urlencoded({extended: true}));
app.use("/api", api);
app.use("/ws", ws);
app.use("/js/obs-websocket.js", (req, res) => {
    res.download(path.join(__dirname, "node_modules/obs-websocket-js/dist/obs-websocket.js"));
});

app.listen(settings.express.port);
console.log(`Listening on port ${settings.express.port}.`);

process.on("unhandledRejection", (err) => {
    console.log(err);
});
