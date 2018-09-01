const Spotify = require("../spotify");

//   ###                  #       #      ##          #   #          ##
//  #   #                 #             #  #         #   #           #
//  #      # ##    ###   ####    ##     #     #   #  #   #   ###     #    #   #  ## #    ###
//   ###   ##  #  #   #   #       #    ####   #   #   # #   #   #    #    #   #  # # #  #   #
//      #  ##  #  #   #   #       #     #     #  ##   # #   #   #    #    #   #  # # #  #####
//  #   #  # ##   #   #   #  #    #     #      ## #   # #   #   #    #    #  ##  # # #  #
//   ###   #       ###     ##    ###    #         #    #     ###    ###    ## #  #   #   ###
//         #                                  #   #
//         #                                   ###
/**
 * API that sets the Spotify volume.
 */
class SpotifyVolume {
    //                     #
    //                     #
    // ###    ##    ###   ###
    // #  #  #  #  ##      #
    // #  #  #  #    ##    #
    // ###    ##   ###      ##
    // #
    /**
     * Sets the volume in Spotify.
     * @param {object} req The request object.
     * @param {object} res The response object.
     * @returns {void}
     */
    static async post(req, res) {
        try {
            await Spotify.getSpotifyToken();
            await Spotify.spotify.setVolume(req.body.volume);

            res.status(204);
            res.end();
        } catch (err) {
            res.sendStatus(500);
            console.log(err);
        }
    }
}

module.exports = SpotifyVolume;
