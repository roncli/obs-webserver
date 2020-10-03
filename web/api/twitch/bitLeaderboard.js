/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 * @typedef {import("twitch").HelixBitsLeaderboard} HelixBitsLeaderboard
 */

const Log = require("../../../src/logging/log"),
    Twitch = require("../../../src/twitch");

//  ####     #     #     #                        #                #                               #
//   #  #          #     #                        #                #                               #
//   #  #   ##    ####   #       ###    ###    ## #   ###   # ##   # ##    ###    ###   # ##    ## #
//   ###     #     #     #      #   #      #  #  ##  #   #  ##  #  ##  #  #   #      #  ##  #  #  ##
//   #  #    #     #     #      #####   ####  #   #  #####  #      #   #  #   #   ####  #      #   #
//   #  #    #     #  #  #      #      #   #  #  ##  #      #      ##  #  #   #  #   #  #      #  ##
//  ####    ###     ##   #####   ###    ####   ## #   ###   #      # ##    ###    ####  #       ## #
/**
 * A class that represents the bit leaderboard API.
 */
class BitLeaderboard {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Processes the request.
     * @param {Express.Request} req The request.
     * @param {Express.Response} res The response.
     * @returns {Promise} A promise that resolves when the request is completed.
     */
    static async get(req, res) {
        /** @type {HelixBitsLeaderboard} */
        let bits;
        try {
            bits = await Twitch.channelTwitchClient.helix.bits.getLeaderboard({
                count: 100,
                period: "all"
            });
        } catch (err) {
            Log.exception("There was an error retrieving the bit leaderboard.", err);
            res.status(500).send();
            return;
        }

        res.status(200).json(bits.entries.map((b) => ({rank: b.rank, name: b.userDisplayName, bits: b.amount})));
    }
}

BitLeaderboard.route = {
    path: "/api/twitch/bit-leaderboard"
};

module.exports = BitLeaderboard;
