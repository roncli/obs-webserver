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
    static post(req, res) {
        Spotify.getSpotifyToken().then(() => Spotify.spotify.volume(req.body.volume)).then(() => {
            res.status(204);
            res.end();
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
    }
}

module.exports = SpotifyVolume;
