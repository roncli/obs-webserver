const Spotify = require("../spotify");

//   ###                  #       #      ##          ####    ##
//  #   #                 #             #  #         #   #    #
//  #      # ##    ###   ####    ##     #     #   #  #   #    #     ###   #   #
//   ###   ##  #  #   #   #       #    ####   #   #  ####     #        #  #   #
//      #  ##  #  #   #   #       #     #     #  ##  #        #     ####  #  ##
//  #   #  # ##   #   #   #  #    #     #      ## #  #        #    #   #   ## #
//   ###   #       ###     ##    ###    #         #  #       ###    ####      #
//         #                                  #   #                       #   #
//         #                                   ###                         ###
/**
 * API that plays a song or playlist on Spotify.
 */
class SpotifyPlay {
    //                     #
    //                     #
    // ###    ##    ###   ###
    // #  #  #  #  ##      #
    // #  #  #  #    ##    #
    // ###    ##   ###      ##
    // #
    /**
     * Plays the song or playlist in Spoitfy.
     * @param {object} req The request object.
     * @param {object} res The response object.
     * @returns {void}
     */
    static async post(req, res) {
        try {
            await Spotify.getSpotifyToken();
            await Spotify.spotify.play({uris: req.body.track ? [req.body.track] : void 0, context_uri: req.body.playlist});

            if (req.body.stop) {
                Spotify.stopAfterCurrentSong();
            }

            res.sendStatus(204);
        } catch (err) {
            res.sendStatus(500);
            console.log(err);
        }
    }
}

module.exports = SpotifyPlay;
