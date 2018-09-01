const express = require("express"),
    router = express.Router(),
    fs = require("fs"),
    path = require("path"),
    {promisify} = require("util");

router.all("/:api", async (req, res) => {
    const {params: {api}} = req;

    // Don't allow calls to index.js.
    if (api === "index") {
        res.sendStatus(404);
        return;
    }

    const filename = path.join(__dirname, `${api}.js`);

    try {
        await promisify(fs.access)(filename, fs.constants.R_OK);

        const {[req.method.toLocaleLowerCase()]: fx} = require(filename);

        if (fx && typeof fx === "function") {
            try {
                await fx(req, res);
            } catch (err) {
                res.sendStatus(500);
                console.log(err);
            }
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.sendStatus(404);
    }
});

module.exports = router;
