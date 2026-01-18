/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 * @typedef {{[x: string]: any}} Settings
 */

const ConfigFile = require("../../src/configFile"),
    Websocket = require("../../src/websocket");

// MARK: class BannersAPI
/**
 * A class that represents the Banners API.
 */
class BannersAPI {
    // MARK: static get
    /**
     * Processes the request.
     * @param {Express.Request} req The request.
     * @param {Express.Response} res The response.
     * @returns {void}
     */
    static get(req, res) {
        res.json({data: ConfigFile.get("roncliGaming").banners || []});
    }

    // MARK: static post
    /**
     * Processes the request.
     * @param {Express.Request} req The request.
     * @param {Express.Response} res The response.
     * @returns {void}
     */
    static post(req, res) {
        const roncliGaming = ConfigFile.get("roncliGaming");

        roncliGaming.banners = req.body;

        ConfigFile.set({roncliGaming});

        Websocket.broadcast({
            type: "settings",
            data: {
                type: "banners",
                data: req.body
            }
        });

        res.sendStatus(204);
    }
}

BannersAPI.route = {
    path: "/api/banners"
};

module.exports = BannersAPI;
