/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 */

const Log = require("../../src/logging/log"),
    SMTC = require("../../src/smtc");

// MARK: class SMTCApi
/**
 * A class that represents the SMTC API.
 */
class SMTCApi {
    // MARK: static async get
    /**
     * Processes the request.
     * @param {Express.Request} req The request.
     * @param {Express.Response} res The response.
     * @returns {void}
     */
    static get(req, res) {
        switch (req.params.command) {
            case "now-playing":
                try {
                    const track = SMTC.getCurrentTrack();
                    res.json(track);
                } catch (err) {
                    Log.exception("There was an error with getting the SMTC current track.", err);
                    res.sendStatus(500);
                }
                break;
            default:
                res.sendStatus(404);
                break;
        }
    }
}

SMTCApi.route = {
    path: "/api/smtc/:command"
};

module.exports = SMTCApi;
