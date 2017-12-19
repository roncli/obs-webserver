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
 * API that plays a song on Spotify.
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
     * Returns what's now playing in Spotify.
     * @param {object} req The request object.
     * @param {object} res The response object.
     * @returns {void}
     */
    static post(req, res) {
        Spotify.getSpotifyToken().then(() => Spotify.spotify.play({uris: req.body.track ? [req.body.track] : void 0, context_uri: req.body.playlist}).then(() => {
            if (req.body.stop) {
                Spotify.stopAfterCurrentSong();
            }

            res.status(204);
            res.end();
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        }));
    }
}

module.exports = SpotifyPlay;
