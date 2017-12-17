const config = require("./config"),
    SpotifyApi = require("spotify-web-api-node");

let accessTokenValid = false;

//   ###                  #       #      ##
//  #   #                 #             #  #
//  #      # ##    ###   ####    ##     #     #   #
//   ###   ##  #  #   #   #       #    ####   #   #
//      #  ##  #  #   #   #       #     #     #  ##
//  #   #  # ##   #   #   #  #    #     #      ## #
//   ###   #       ###     ##    ###    #         #
//         #                                  #   #
//         #                                   ###
/**
 * Helper functions for Spotify.
 */
class Spotify {
    //              #     ##                #     #      #         ###         #
    //              #    #  #               #           # #         #          #
    //  ###   ##   ###    #    ###    ##   ###   ##     #    #  #   #     ##   # #    ##   ###
    // #  #  # ##   #      #   #  #  #  #   #     #    ###   #  #   #    #  #  ##    # ##  #  #
    //  ##   ##     #    #  #  #  #  #  #   #     #     #     # #   #    #  #  # #   ##    #  #
    // #      ##     ##   ##   ###    ##     ##  ###    #      #    #     ##   #  #   ##   #  #
    //  ###                    #                              #
    /**
     * Ensures that Spotify has an access token to work with.
     * @returns {Promise} A promise that resolves with the access token.
     */
    static getSpotifyToken() {
        if (!Spotify.spotify) {
            Spotify.spotify = new SpotifyApi(config.spotify);
        }

        return new Promise((resolve, reject) => {
            if (accessTokenValid) {
                resolve();
                return;
            }

            Spotify.spotify.refreshAccessToken().then((data) => {
                setTimeout(() => {
                    accessTokenValid = false;
                }, 3540000);
                Spotify.spotify.setAccessToken(data.body.access_token);
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }
}

module.exports = Spotify;
