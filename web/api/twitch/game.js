/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 * @typedef {import("@twurple/api").HelixBitsLeaderboard} HelixBitsLeaderboard
 */

const Log = require("../../../src/logging/log"),
    Twitch = require("../../../src/twitch");

// MARK: class Game
/**
 * A class that represents the game API.
 */
class Game {
    // MARK: static async get
    /**
     * Processes the request.
     * @param {Express.Request} req The request.
     * @param {Express.Response} res The response.
     * @returns {Promise} A promise that resolves when the request is completed.
     */
    static async get(req, res) {
        let games;
        try {
            games = await Twitch.searchGameList("Desc");
        } catch (err) {
            Log.exception("There was an error retrieving the game list.", err);
            res.status(500).send();
            return;
        }

        res.status(200).json(games);
    }
}

Game.route = {
    path: "/api/twitch/game"
};

module.exports = Game;
