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
    static post(req, res) {
        Spotify.getSpotifyToken().then(() => Spotify.spotify.pause()).then(() => {
            res.sendStatus(204);
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
    }
}

module.exports = SpotifyPause;
