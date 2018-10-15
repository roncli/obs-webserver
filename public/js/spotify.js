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
    //       ##                ###   ##                ##     #            #
    //        #                #  #   #                 #                  #
    // ###    #     ###  #  #  #  #   #     ###  #  #   #    ##     ###   ###
    // #  #   #    #  #  #  #  ###    #    #  #  #  #   #     #    ##      #
    // #  #   #    # ##   # #  #      #    # ##   # #   #     #      ##    #
    // ###   ###    # #    #   #     ###    # #    #   ###   ###   ###      ##
    // #                  #                       #
    /**
     * Plays a Spotify playlist.
     * @param {string} playlist The Spotify Uri of the playlist to play.
     * @param {boolean} stop Whether to stop the playlist after one song.
     * @returns {void}
     */
    static playPlaylist(playlist, stop) {
        const x = new XMLHttpRequest();

        x.timeout = 5000;
        x.open("POST", "api/spotifyPlay", true);
        x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        x.send(`playlist=${playlist}${stop ? "&stop=true" : ""}`);
    }

    // ###    ###  #  #   ###    ##
    // #  #  #  #  #  #  ##     # ##
    // #  #  # ##  #  #    ##   ##
    // ###    # #   ###  ###     ##
    // #
    /**
     * Pauses Spotify.
     * @returns {void}
     */
    static pause() {
        const x = new XMLHttpRequest();

        x.timeout = 5000;
        x.open("POST", "api/spotifyPause", true);
        x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        x.send();
    }

    //                      #   ##                #     #      #
    //                      #  #  #               #           # #
    // ###    ##    ###   ###   #    ###    ##   ###   ##     #    #  #
    // #  #  # ##  #  #  #  #    #   #  #  #  #   #     #    ###   #  #
    // #     ##    # ##  #  #  #  #  #  #  #  #   #     #     #     # #
    // #      ##    # #   ###   ##   ###    ##     ##  ###    #      #
    //                               #                              #
    /**
     * Reads now playing information from Spotify.
     * @returns {Promise} A promise that resolves with the Spotify information.
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

            x.open("GET", "api/spotifyNowPlaying", true);
            x.send();
        });
    }

    //               #     ##                #     #      #         #  #        ##
    //               #    #  #               #           # #        #  #         #
    //  ###    ##   ###    #    ###    ##   ###   ##     #    #  #  #  #   ##    #    #  #  # #    ##
    // ##     # ##   #      #   #  #  #  #   #     #    ###   #  #  #  #  #  #   #    #  #  ####  # ##
    //   ##   ##     #    #  #  #  #  #  #   #     #     #     # #   ##   #  #   #    #  #  #  #  ##
    // ###     ##     ##   ##   ###    ##     ##  ###    #      #    ##    ##   ###    ###  #  #   ##
    //                          #                              #
    /**
     * Sets the Spotify volume.
     * @param {number} volume A percent value to set the volume to.
     * @returns {void}
     */
    static setSpotifyVolume(volume) {
        const x = new XMLHttpRequest();

        x.timeout = 5000;
        x.open("POST", "api/spotifyVolume", true);
        x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        x.send(`volume=${volume}`);
    }
}

window.Spotify = Spotify;
