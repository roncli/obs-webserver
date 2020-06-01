/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 */

const Log = require("../../src/logging/log"),
    Spotify = require("../../src/spotify");

//   ###                  #       #      ##            #             #
//  #   #                 #             #  #          # #
//  #      # ##    ###   ####    ##     #     #   #  #   #  # ##    ##
//   ###   ##  #  #   #   #       #    ####   #   #  #   #  ##  #    #
//      #  ##  #  #   #   #       #     #     #  ##  #####  ##  #    #
//  #   #  # ##   #   #   #  #    #     #      ## #  #   #  # ##     #
//   ###   #       ###     ##    ###    #         #  #   #  #       ###
//         #                                  #   #         #
//         #                                   ###          #
/**
 * A class that represents the Spotify API.
 */
class SpotifyApi {
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
        switch (req.params.command) {
            case "now-playing":
                try {
                    const track = await Spotify.nowPlaying();
                    res.json(track);
                } catch (err) {
                    if ([503, 504].indexOf(err.statusCode) === -1) {
                        // Do not log 503/504 errors, as they are common with Spotify's API due to their design.
                        Log.exception("There was an error with getting the Spotify now playing list.", err);
                    }
                    res.sendStatus(500);
                }
                break;
            default:
                res.sendStatus(404);
                break;
        }
    }
}

SpotifyApi.route = {
    path: "/api/spotify/:command"
};

module.exports = SpotifyApi;
