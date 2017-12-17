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
        Spotify.nowPlaying().then((track) => {
            res.status(200);
            res.send(JSON.stringify(track));
            res.end();
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
    }
}

module.exports = SpotifyNowPlaying;
