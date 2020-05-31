/**
 * @typedef {import("../../types/spotifyTypes").Track} SpotifyTypes.Track
 */

//  #   #
//  #   #
//  #   #   ###   ## #    ###
//  #####  #   #  # # #  #   #
//  #   #  #   #  # # #  #####
//  #   #  #   #  # # #  #
//  #   #   ###   #   #   ###
/**
 * A class that provides functions for the home page.
 */
class Home {
    // ###    ##   #  #   ##                #                 #    #                    #           #
    // #  #  #  #  ####  #  #               #                 #    #                    #           #
    // #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
    // #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
    // #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
    // ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
    /**
     * Sets up the page's events.
     * @returns {void}
     */
    static DOMContentLoaded() {
        setTimeout(async () => {
            Home.startWebsocket();
            Home.spotify = false;

            // await window.Common.loadTemplate("/js/?files=/views/home/spotify.js,/views/home/game/title.js,/views/home/game/info.js,/views/home/game/support.js,/views/home/game/recent.js,/views/home/game/notification.js,/views/home/game.js,/js/home/game.js", "GameView");

            // await window.Common.loadDataIntoTemplate("/api/config/roncliGaming", "#scene", window.GameView.get);

            // window.Game.start();

            await window.Common.loadTemplate("/js/?files=/views/home/spotify.js,/views/home/frame.js,/js/home/frame.js", "FrameView");

            document.getElementById("scene").innerHTML = window.FrameView.get(true);

            window.Frame.start();

        }, 5000);
    }

    //         #                 #     ##                #     #      #
    //         #                 #    #  #               #           # #
    //  ###   ###    ###  ###   ###    #    ###    ##   ###   ##     #    #  #
    // ##      #    #  #  #  #   #      #   #  #  #  #   #     #    ###   #  #
    //   ##    #    # ##  #      #    #  #  #  #  #  #   #     #     #     # #
    // ###      ##   # #  #       ##   ##   ###    ##     ##  ###    #      #
    //                                      #                              #
    /**
     * Starts the updating of Spotify.
     * @returns {void}
     */
    static startSpotify() {
        Home.spotify = true;

        if (Home.spotifyTimeout) {
            clearTimeout(Home.spotifyTimeout);
        }

        Home.updateSpotify(5000);
    }

    //         #                 #    #  #        #                        #            #
    //         #                 #    #  #        #                        #            #
    //  ###   ###    ###  ###   ###   #  #   ##   ###    ###    ##    ##   # #    ##   ###
    // ##      #    #  #  #  #   #    ####  # ##  #  #  ##     #  #  #     ##    # ##   #
    //   ##    #    # ##  #      #    ####  ##    #  #    ##   #  #  #     # #   ##     #
    // ###      ##   # #  #       ##  #  #   ##   ###   ###     ##    ##   #  #   ##     ##
    /**
     * Starts the WebSocket connection.
     * @returns {void}
     */
    static startWebsocket() {
        /** @type {WebSocket} */
        Home.ws = new WebSocket("ws://" + document.location.hostname + ":" + (document.location.port || "80") + "/");

        Home.ws.onmessage = (ev) => {
            const data = JSON.parse(ev.data);

            switch (data.type) {
                case "updateSpotify":
                    if (Home.spotify) {
                        Home.startSpotify();
                    }
                    return;
                case "clearSpotify":
                    Home.spotifyTrack = void 0;
                    break;
            }

            if (window.handleMessage) {
                window.handleMessage(data);
            }
        };
    }

    //         #                 ##                #     #      #
    //         #                #  #               #           # #
    //  ###   ###    ##   ###    #    ###    ##   ###   ##     #    #  #
    // ##      #    #  #  #  #    #   #  #  #  #   #     #    ###   #  #
    //   ##    #    #  #  #  #  #  #  #  #  #  #   #     #     #     # #
    // ###      ##   ##   ###    ##   ###    ##     ##  ###    #      #
    //                    #           #                              #
    /**
     * Stops the updating of Spotify.
     * @returns {void}
     */
    static stopSpotify() {
        if (Home.spotifyTimeout) {
            clearTimeout(Home.spotifyTimeout);
        }
        Home.spotify = false;
    }

    //                #         #           ##                #     #      #
    //                #         #          #  #               #           # #
    // #  #  ###    ###   ###  ###    ##    #    ###    ##   ###   ##     #    #  #
    // #  #  #  #  #  #  #  #   #    # ##    #   #  #  #  #   #     #    ###   #  #
    // #  #  #  #  #  #  # ##   #    ##    #  #  #  #  #  #   #     #     #     # #
    //  ###  ###    ###   # #    ##   ##    ##   ###    ##     ##  ###    #      #
    //       #                                   #                              #
    /**
     * Updates the currently playing Spotify track.
     * @param {number} interval The interval in milliseconds to update the information.
     * @returns {void}
     */
    static async updateSpotify(interval) {
        let thisInterval;

        try {
            Home.spotifyTrack = await window.Spotify.readSpotify();

            if (Home.spotifyTrack.playing) {
                thisInterval = Math.min(1000 + Home.spotifyTrack.duration - Home.spotifyTrack.progress || interval, interval);
            } else {
                Home.spotifyTrack = void 0;
                thisInterval = void 0;
            }

            if (window.handleMessage) {
                window.handleMessage({
                    type: "updateSpotify",
                    track: Home.spotifyTrack
                });
            }
        } finally {
            Home.spotifyTimeout = setTimeout(() => {
                Home.updateSpotify(interval);
            }, thisInterval || interval);
        }
    }
}

/** @type {{[x: string]: object}} */
Home.data = {
    recent: []
};

Home.spotify = false;

/** @type {NodeJS.Timeout} */
Home.spotifyTimeout = void 0;

/** @type {SpotifyTypes.Track} */
Home.spotifyTrack = void 0;

/** @type {WebSocket} */
Home.ws = void 0;

document.addEventListener("DOMContentLoaded", Home.DOMContentLoaded);

window.Home = Home;
