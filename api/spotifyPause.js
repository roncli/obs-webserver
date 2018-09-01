const Spotify = require("../spotify");

//   ###                  #       #      ##          ####
//  #   #                 #             #  #         #   #
//  #      # ##    ###   ####    ##     #     #   #  #   #   ###   #   #   ###    ###
//   ###   ##  #  #   #   #       #    ####   #   #  ####       #  #   #  #      #   #
//      #  ##  #  #   #   #       #     #     #  ##  #       ####  #   #   ###   #####
//  #   #  # ##   #   #   #  #    #     #      ## #  #      #   #  #  ##      #  #
//   ###   #       ###     ##    ###    #         #  #       ####   ## #  ####    ###
//         #                                  #   #
//         #                                   ###
/**
 * API that pauses Spotify.
 */
class SpotifyPause {
    //                     #
    //                     #
    // ###    ##    ###   ###
    // #  #  #  #  ##      #
    // #  #  #  #    ##    #
    // ###    ##   ###      ##
    // #
    /**
     * Pauses Spoitfy.
     * @param {object} req The request object.
     * @param {object} res The response object.
     * @returns {void}
     */
    static async post(req, res) {
        try {
            await Spotify.getSpotifyToken();
            await Spotify.spotify.pause();
            res.sendStatus(204);
        } catch (err) {
            if (err.statusCode === 403) {
                // Forbidden from the Spotify API means that the player is already paused, which is fine.
                res.sendStatus(204);
            } else {
                res.sendStatus(500);
                console.log(err);
            }
        }
    }
}

module.exports = SpotifyPause;
