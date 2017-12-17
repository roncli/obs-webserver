const express = require("express"),
    router = express.Router(),
    fs = require("fs"),
    path = require("path"),
    {promisify} = require("util");

router.all("/:api", (req, res) => {
    const {params: {api}} = req;

    // Don't allow calls to index.js.
    if (api === "index") {
        res.sendStatus(404);
        return;
    }

    const filename = path.join(__dirname, `${api}.js`);

    promisify(fs.access)(filename, fs.constants.R_OK).then(() => {
        const {[req.method.toLocaleLowerCase()]: fx} = require(filename);

        if (fx && typeof fx === "function") {
            try {
                fx(req, res);
            } catch (err) {
                res.sendStatus(500);
                console.log(err);
            }
        } else {
            res.sendStatus(404);
        }
    }).catch(() => {
        res.sendStatus(404);
    });
});

module.exports = router;
