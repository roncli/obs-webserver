/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 */

const Log = require("../../src/logging/log"),
    Spotify = require("../../src/spotify"),
    Websocket = require("../../src/websocket");

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

    //                     #
    //                     #
    // ###    ##    ###   ###
    // #  #  #  #  ##      #
    // #  #  #  #    ##    #
    // ###    ##   ###      ##
    // #
    /**
     * Processes the request.
     * @param {Express.Request} req The request.
     * @param {Express.Response} res The response.
     * @returns {Promise} A promise that resolves when the request is completed.
     */
    static async post(req, res) {
        let okToSend = false;

        switch (req.params.command) {
            case "pause":
                try {
                    await Spotify.getSpotifyToken();
                    await Spotify.spotify.pause();

                    res.sendStatus(204);
                    okToSend = true;
                } catch (err) {
                    if (err.statusCode === 403) {
                        // Forbidden from the Spotify API means that the player is already paused, which is fine.
                        res.sendStatus(204);
                        okToSend = true;
                    } else {
                        Log.exception("There was an error pausing Spotify.", err);
                        res.sendStatus(500);
                    }
                }

                if (okToSend) {
                    Websocket.broadcast({
                        type: "clearSpotify"
                    });
                }
                break;
            case "play":
                try {
                    await Spotify.getSpotifyToken();
                    await Spotify.spotify.setVolume(req.body.volume);
                    await Spotify.spotify.play({uris: req.body.track ? [req.body.track] : void 0, "context_uri": req.body.playlist});

                    res.sendStatus(204);
                    okToSend = true;
                } catch (err) {
                    Log.exception("There was an error playing Spotify.", err);
                    res.sendStatus(500);
                }

                if (okToSend) {
                    Websocket.broadcast({
                        type: "updateSpotify"
                    });
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
