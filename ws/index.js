const express = require("express"),
    router = express.Router(),
    fs = require("fs"),
    path = require("path"),
    {promisify} = require("util");

router.ws("/:api", (ws, req) => {
    const {params: {api}} = req;

    // Don't allow calls to index.js.
    if (api === "index") {
        ws.close(1003, "Endpoint not found.");
        return;
    }

    const filename = path.join(__dirname, `${api}.js`);

    promisify(fs.access)(filename, fs.constants.R_OK).then(() => {
        const Api = require(filename);

        Object.getOwnPropertyNames(Api).filter((prop) => typeof Api[prop] === "function").forEach((key) => {
            ws.on(key, (...args) => {
                Api[key].apply(ws, args);
            });
        });

        ws.emit("init");
    }).catch((err) => {
        ws.close(1011, "An server error occurred.");
        console.log(err);
    });
});

module.exports = router;
