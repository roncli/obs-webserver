/**
 * @typedef {import("express").Router} Express.Router
 */

const compression = require("compression"),
    express = require("express"),
    expressWs = require("express-ws"),
    Minify = require("./src/minify"),

    ConfigFile = require("./src/configFile"),
    Discord = require("./src/discord"),
    Listeners = require("./src/listeners"),
    Log = require("./src/logging/log"),
    Redirects = require("./src/redirects"),
    Router = require("./src/router"),
    settings = require("./settings"),
    Twitch = require("./src/twitch");

// MARK: async function startup
/**
 * Starts up the application.
 */
(async function startup() {
    Log.log("Starting up...");

    // Set title.
    if (process.platform === "win32") {
        process.title = "roncli Gaming";
    } else {
        process.stdout.write("\x1b]2;roncli Gaming\x1b\x5c");
    }

    // Load the config.
    ConfigFile.setup();

    // Setup express app.
    const app = express();

    // Startup websockets.
    expressWs(app);

    // Get the router.
    /** @type {Express.Router} */
    let router;
    try {
        router = await Router.getRouter();
    } catch (err) {
        Log.exception("There was an error while getting the router.", err);
        return;
    }

    // Setup various listeners.
    Listeners.setup();

    // Startup Discord.
    Discord.startup();
    await Discord.connect();

    // Startup Twitch.
    await Twitch.connect();

    // Initialize middleware stack.
    app.use(express.json());
    app.use(compression());

    // Setup public redirects.
    app.use(express.static("public"));

    // Setup JS/CSS handlers.
    app.get("/css", Minify.cssHandler);
    app.get("/js", Minify.jsHandler);

    // Setup redirect routes.
    app.get("*", (req, res, next) => {
        const redirect = Redirects[req.path];
        if (!redirect) {
            next();
            return;
        }

        res.status(200).contentType(redirect.contentType).sendFile(`${__dirname}/${redirect.path}`);
    });

    // tsconfig.json is not meant to be served, 404 it if it's requested directly.
    app.use("/tsconfig.json", (req, res, next) => {
        req.method = "GET";
        req.url = "/404";
        router(req, res, next);
    });

    // 500 is an internal route, 404 it if it's requested directly.
    app.use("/500", (req, res, next) => {
        req.method = "GET";
        req.url = "/404";
        router(req, res, next);
    });

    // Setup dynamic routing.
    app.use("/", router);

    // 404 remaining pages.
    app.use((req, res, next) => {
        req.method = "GET";
        req.url = "/404";
        router(req, res, next);
    });

    // 500 errors.
    app.use((err, req, res, next) => {
        Log.exception("Unhandled error has occurred.", err);
        req.method = "GET";
        req.url = "/500";
        router(req, res, next);
    });

    // Startup web server.
    const port = process.env.PORT || settings.express.port;

    app.listen(port);
    Log.log(`Web server listening on port ${port}.`);
}());

process.on("unhandledRejection", (reason, promise) => {
    Log.exception("Unhandled promise rejection caught.", reason);
    console.log(promise);
});
