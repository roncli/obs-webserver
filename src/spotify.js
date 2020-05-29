/**
 * @typedef {import("../types/SpotifyTypes").Track} SpotifyTypes.Track
 */

const settings = require("../settings"),
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
     * @returns {Promise} A promise that resolves when the access token has been retrieved.
     */
    static async getSpotifyToken() {
        if (!Spotify.spotify) {
            Spotify.spotify = new SpotifyApi(settings.spotify);
        }

        if (accessTokenValid) {
            return;
        }

        const data = await Spotify.spotify.refreshAccessToken();

        setTimeout(() => {
            accessTokenValid = false;
        }, 3540000);

        Spotify.spotify.setAccessToken(data.body.access_token);
    }

    //                   ###   ##                 #
    //                   #  #   #
    // ###    ##   #  #  #  #   #     ###  #  #  ##    ###    ###
    // #  #  #  #  #  #  ###    #    #  #  #  #   #    #  #  #  #
    // #  #  #  #  ####  #      #    # ##   # #   #    #  #   ##
    // #  #   ##   ####  #     ###    # #    #   ###   #  #  #
    //                                      #                 ###
    /**
     * Returns the currently playing track.
     * @returns {Promise<SpotifyTypes.Track>} A promise that resolves with the currently playing track.
     */
    static async nowPlaying() {
        await Spotify.getSpotifyToken();

        const response = await Spotify.spotify.getMyCurrentPlayingTrack();

        if (response && response.body && response.body.item) {
            return {
                playing: response.body.is_playing,
                progress: response.body.progress_ms,
                duration: response.body.item.duration_ms,
                imageUrl: response.body.item.album.images[0] && response.body.item.album.images[0].url || void 0,
                title: response.body.item.name,
                artist: response.body.item.artists[0].name
            };
        }

        return {};
    }
}

/** @type {SpotifyApi} */
Spotify.spotify = void 0;

/** @type {NodeJS.Timer} */
Spotify.stopTimeout = void 0;

module.exports = Spotify;
