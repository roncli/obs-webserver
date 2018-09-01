const config = require("./config"),
    SpotifyApi = require("spotify-web-api-node"),
    SpotifyWebHelper = require("spotify-webhelper"),
    {promisify} = require("util");
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
            Spotify.spotify = new SpotifyApi(config.spotify);
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
     * @returns {Promise<{playing: boolean, progress: number, duration: number, imageUrl: string?, title: string, artist: string}>} A promise that resolves with the currently playing track.
     */
    static async nowPlaying() {
        try {
            await Spotify.getSpotifyToken();

            const response = await Spotify.spotify.getMyCurrentPlayingTrack();

            if (response && response.body && response.body.item) {
                return {
                    playing: response.body.is_playing,
                    progress: response.body.progress_ms,
                    duration: response.body.item.duration_ms,
                    imageUrl: response.body.item.album.images[0] && response.body.item.album.images[0].url,
                    title: response.body.item.name,
                    artist: response.body.item.artists[0].name
                };
            }

            return {};
        } catch (err) {
            if (err.statusCode === 400 || err.statusCode === 502) {
                const webHelper = new SpotifyWebHelper.SpotifyWebHelper(),
                    response = await promisify(webHelper.getStatus).bind(webHelper)();

                return {
                    playing: response.playing,
                    progress: Math.round(response.playing_position * 1000),
                    duration: response.track.length * 1000,
                    title: response.track.track_resource && response.track.track_resource.name,
                    artist: response.track.artist_resource && response.track.artist_resource.name
                };
            }

            throw err;
        }
    }

    //         #                 ##     #    #                 ##                                  #     ##
    //         #                #  #   # #   #                #  #                                 #    #  #
    //  ###   ###    ##   ###   #  #   #    ###    ##   ###   #     #  #  ###   ###    ##   ###   ###    #     ##   ###    ###
    // ##      #    #  #  #  #  ####  ###    #    # ##  #  #  #     #  #  #  #  #  #  # ##  #  #   #      #   #  #  #  #  #  #
    //   ##    #    #  #  #  #  #  #   #     #    ##    #     #  #  #  #  #     #     ##    #  #   #    #  #  #  #  #  #   ##
    // ###      ##   ##   ###   #  #   #      ##   ##   #      ##    ###  #     #      ##   #  #    ##   ##    ##   #  #  #
    //                    #                                                                                                ###
    /**
     * Stops playback after the current song.
     * @returns {void}
     */
    static stopAfterCurrentSong() {
        if (Spotify.stopTimeout) {
            clearTimeout(Spotify.stopTimeout);
        }

        setTimeout(async () => {
            try {
                const track = await Spotify.nowPlaying();

                if (track && track.progress && track.duration) {
                    Spotify.stopTimeout = setTimeout(() => Spotify.spotify.pause(), track.duration - track.progress);
                }
            } catch (err) {
                Spotify.stopAfterCurrentSong();
            }
        }, 2500);
    }
}

module.exports = Spotify;
