/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 */

const Log = require("../../../src/logging/log"),
    Twitch = require("../../../src/twitch");

//  ####            ##                        #
//  #   #          #  #                       #
//  #   #   ###    #     # ##    ###    ###   # ##
//  ####   #   #  ####   ##  #  #   #  #      ##  #
//  # #    #####   #     #      #####   ###   #   #
//  #  #   #       #     #      #          #  #   #
//  #   #   ###    #     #       ###   ####   #   #
/**
 * A class that represents the Twitch Refresh API.
 */
class Refresh {
    //                        #
    //                        #
    //  # ##    ###    ###   ####
    //  ##  #  #   #  #       #
    //  ##  #  #   #   ###    #
    //  # ##   #   #      #   #  #
    //  #       ###   ####     ##
    //  #
    //  #
    /**
     * Processes the request.
     * @param {Express.Request} req The request.
     * @param {Express.Response} res The response.
     * @returns {Promise} A promise that resolves when the request has been processed.
     */
    static async post(req, res) {
        try {
            await Twitch.refreshTokens();
        } catch (err) {
            Log.exception("There was an error refresing the Twitch tokens.", err);
            res.status(500).send();
            return;
        }

        res.status(204).send();
    }
}

Refresh.route = {
    path: "/api/twitch/refresh"
};

module.exports = Refresh;
