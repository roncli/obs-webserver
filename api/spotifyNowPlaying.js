const Spotify = require("../spotify");

//   ###                  #       #      ##          #   #                ####    ##                    #
//  #   #                 #             #  #         #   #                #   #    #
//  #      # ##    ###   ####    ##     #     #   #  ##  #   ###   #   #  #   #    #     ###   #   #   ##    # ##    ## #
//   ###   ##  #  #   #   #       #    ####   #   #  # # #  #   #  #   #  ####     #        #  #   #    #    ##  #  #  #
//      #  ##  #  #   #   #       #     #     #  ##  #  ##  #   #  # # #  #        #     ####  #  ##    #    #   #   ##
//  #   #  # ##   #   #   #  #    #     #      ## #  #   #  #   #  # # #  #        #    #   #   ## #    #    #   #  #
//   ###   #       ###     ##    ###    #         #  #   #   ###    # #   #       ###    ####      #   ###   #   #   ###
//         #                                  #   #                                            #   #                #   #
//         #                                   ###                                              ###                  ###
/**
 * API to retrieve what's now playing in Spotify.
 */
class SpotifyNowPlaying {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Returns what's now playing in Spotify.
     * @param {object} req The request object.
     * @param {object} res The response object.
     * @returns {void}
     */
    static get(req, res) {
        Spotify.getSpotifyToken().then(() => {
            Spotify.spotify.getMyCurrentPlayingTrack().then((response) => {
                res.status(200);
                res.send(JSON.stringify(response.body));
                res.end();
            }).catch((err) => {
                if (err.statusCode === 400) {
                    res.send("{}");
                    res.sendStatus(200);
                    return;
                }

                res.sendStatus(500);
                console.log(err);
            });
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
    }
}

module.exports = SpotifyNowPlaying;
