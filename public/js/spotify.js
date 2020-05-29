/**
 * @typedef {import("../../types/spotifyTypes").Track} SpotifyTypes.Track
 */

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
 * A class of static functions to control Spotify.
 */
class Spotify {
    //                      #   ##                #     #      #
    //                      #  #  #               #           # #
    // ###    ##    ###   ###   #    ###    ##   ###   ##     #    #  #
    // #  #  # ##  #  #  #  #    #   #  #  #  #   #     #    ###   #  #
    // #     ##    # ##  #  #  #  #  #  #  #  #   #     #     #     # #
    // #      ##    # #   ###   ##   ###    ##     ##  ###    #      #
    //                               #                              #
    /**
     * Reads now playing information from Spotify.
     * @returns {Promise<SpotifyTypes.Track>} A promise that resolves with the Spotify information.
     */
    static readSpotify() {
        return new Promise((resolve, reject) => {
            const x = new XMLHttpRequest();

            x.timeout = 5000;
            x.onreadystatechange = function() {
                if (x.readyState !== 4) {
                    return;
                }

                if (x.readyState === 4 && x.status === 200) {
                    resolve(JSON.parse(x.responseText));
                } else {
                    reject(new Error());
                }
            };

            x.ontimeout = function() {
                reject(new Error());
            };

            x.onerror = function() {
                reject(new Error());
            };

            x.open("GET", "api/spotify/now-playing", true);
            x.send();
        });
    }
}

window.Spotify = Spotify;
