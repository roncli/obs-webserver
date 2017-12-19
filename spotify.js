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

    //                   ###   ##                 #
    //                   #  #   #
    // ###    ##   #  #  #  #   #     ###  #  #  ##    ###    ###
    // #  #  #  #  #  #  ###    #    #  #  #  #   #    #  #  #  #
    // #  #  #  #  ####  #      #    # ##   # #   #    #  #   ##
    // #  #   ##   ####  #     ###    # #    #   ###   #  #  #
    //                                      #                 ###
    /**
     * Returns the currently playing track.
     * @returns {Promise} A promise that resolves with the currently playing track.
     */
    static nowPlaying() {
        return new Promise((resolve, reject) => {
            Spotify.getSpotifyToken().then(() => {
                Spotify.spotify.getMyCurrentPlayingTrack().then((response) => {
                    if (response && response.body && response.body.item) {
                        resolve({
                            playing: response.body.is_playing,
                            progress: response.body.progress_ms,
                            duration: response.body.item.duration_ms,
                            imageUrl: response.body.item.album.images[0] && response.body.item.album.images[0].url,
                            title: response.body.item.name,
                            artist: response.body.item.artists[0].name
                        });
                    } else {
                        resolve({});
                    }
                }).catch((err) => {
                    if (err.statusCode === 400) {
                        const webHelper = new SpotifyWebHelper.SpotifyWebHelper();

                        promisify(webHelper.getStatus).bind(webHelper)().then((response) => {
                            resolve({
                                playing: response.playing,
                                progress: Math.round(response.playing_position * 1000),
                                duration: response.track.length * 1000,
                                title: response.track.track_resource.name,
                                artist: response.track.artist_resource.name
                            });
                        }).catch(reject);

                        return;
                    }

                    reject(err);
                });
            }).catch(reject);
        });
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

        Spotify.nowPlaying().then((track) => {
            if (track && track.progress && track.duration) {
                Spotify.stopTimeout = setTimeout(() => Spotify.spotify.pause(), track.duration - track.progress);
            }
        }).catch(() => {
            Spotify.stopAfterCurrentSong();
        });
    }
}

module.exports = Spotify;
