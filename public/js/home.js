/**
 * @typedef {import("../../types/spotifyTypes").Track} SpotifyTypes.Track
 */

// MARK: class Home
/**
 * A class that provides functions for the home page.
 */
class Home {
    // MARK: static DOMContentLoaded
    /**
     * Sets up the page's events.
     * @returns {void}
     */
    static DOMContentLoaded() {
        Home.startWebsocket();
        Home.spotify = false;
    }

    //                          ##                #     #      #
    //                         #  #               #           # #
    // # #    ##   # #    ##    #    ###    ##   ###   ##     #    #  #
    // ####  #  #  # #   # ##    #   #  #  #  #   #     #    ###   #  #
    // #  #  #  #  # #   ##    #  #  #  #  #  #   #     #     #     # #
    // #  #   ##    #     ##    ##   ###    ##     ##  ###    #      #
    //                               #                              #
    /**
     * Move Spotify to the specified top position.
     * @param {string} top The top position.
     * @returns {void}
     */
    static moveSpotify(top) {
        const spotify = document.getElementById("spotify");

        if (spotify) {
            spotify.style.top = top;
        }
    }

    // MARK: static async startAnalysis
    /**
     * Starts the analysis scene.
     * @returns {Promise} A promise that resolves when the analysis scene has been started.
     */
    static async startAnalysis() {
        await window.Common.loadTemplate("/js/?files=/views/home/game/title.js,/views/home/game/info.js,/views/home/game/notification.js,/js/home/game.js", "Game");
        await window.Common.loadTemplate("/js/?files=/views/home/game/support.js,/views/home/game/recent.js", "GameSupportView");
        await window.Common.loadTemplate("/js/?files=/views/home/analysis.js", "AnalysisView");

        await window.Common.loadDataIntoTemplate("/api/config/roncliGaming", "#scene", window.AnalysisView.get);

        Home.moveSpotify("");

        window.Game.start();
    }

    // MARK: static async startCTM
    /**
     * Starts the CTM scene.
     * @returns {Promise} A promise that resolves when the ctm scene has been started.
     */
    static async startCTM() {
        await window.Common.loadTemplate("/js/?files=/views/home/game/title.js,/views/home/game/info.js,/views/home/game/notification.js,/js/home/game.js", "Game");
        await window.Common.loadTemplate("/js/?files=/views/home/ctm.js", "CTMView");

        await window.Common.loadDataIntoTemplate("/api/config/roncliGaming", "#scene", window.CTMView.get);

        Home.moveSpotify("586px");

        window.Game.start();
    }

    // MARK: static async startFrame
    /**
     * Starts the frame scene.
     * @returns {Promise} A promise that resolves when the frame scene has been started.
     */
    static async startFrame() {
        await window.Common.loadTemplate("/js/?files=/views/home/frame.js,/js/home/frame.js", "FrameView");

        document.getElementById("scene").innerHTML = window.FrameView.get(true);

        Home.moveSpotify("");

        window.Frame.start();
    }

    // MARK: static async startGame
    /**
     * Starts the game scene.
     * @returns {Promise} A promise that resolves when the game scene has been started.
     */
    static async startGame() {
        await window.Common.loadTemplate("/js/?files=/views/home/game/title.js,/views/home/game/info.js,/views/home/game/notification.js,/js/home/game.js", "Game");
        await window.Common.loadTemplate("/js/?files=/views/home/game/support.js,/views/home/game/recent.js", "GameSupportView");
        await window.Common.loadTemplate("/js/?files=/views/home/game.js", "GameView");

        await window.Common.loadDataIntoTemplate("/api/config/roncliGaming", "#scene", window.GameView.get);

        Home.moveSpotify("");

        window.Game.start();
    }

    // MARK: static async startHeadToHead
    /**
     * Starts the head to head scene.
     * @param {string} banner The URL of the banner.
     * @returns {Promise} A promise that resolves when the head to head scene has been started.
     */
    static async startHeadToHead(banner) {
        await window.Common.loadTemplate("/js/?files=/views/home/game/title.js,/views/home/game/info.js,/views/home/game/notification.js,/js/home/game.js", "Game");
        await window.Common.loadTemplate("/js/?files=/views/home/game/support.js,/views/home/game/recent.js", "GameSupportView");
        await window.Common.loadTemplate("/js/?files=/views/home/headtohead.js", "HeadToHeadView");

        await window.Common.loadDataIntoTemplate("/api/config/roncliGaming", "#scene", window.HeadToHeadView.get);

        /** @type {HTMLDivElement} */
        const bannerDiv = document.getElementById("banner");

        if (bannerDiv) {
            bannerDiv.style.backgroundImage = `url(${banner})`;
        }

        Home.moveSpotify("");

        window.Game.start();
    }

    // MARK: static async startIntro
    /**
     * Starts the intro scene.
     * @returns {Promise} A promise that resolves when the intro scene has been started.
     */
    static async startIntro() {
        await window.Common.loadTemplate("/js/?files=/views/home/intro.js,/js/home/intro.js", "IntroView");

        document.getElementById("scene").innerHTML = window.IntroView.get();

        window.Intro.start();
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

    // MARK: static async startTetris
    /**
     * Starts the updating of Tetris.
     * @param {{organization: string, title: string, color: string}} data The data for the view.
     * @returns {void}
     */
    static async startTetris(data) {
        await window.Common.loadTemplate("/js/?files=/js/home/tetris.js", "Tetris");
        await window.Common.loadTemplate("/js/?files=/views/home/tetris.js", "TetrisView");

        document.getElementById("scene").innerHTML = window.TetrisView.get(data);

        window.Tetris.start();
    }

    // MARK: static async startTetris2P
    /**
     * Starts the updating of Tetris 2P.
     * @param {{event: {organization: string, title: string, status: string, color: string}, player1: {name: string, score: string, info: string}, player2: {name: string, score: string, info: string}}} data The data for the view.
     * @returns {void}
     */
    static async startTetris2P(data) {
        await window.Common.loadTemplate("/js/?files=/js/home/tetris2p.js", "Tetris2P");
        await window.Common.loadTemplate("/js/?files=/views/home/tetris2p.js", "Tetris2PView");

        document.getElementById("scene").innerHTML = window.Tetris2PView.get(data);

        window.Tetris2P.start();
    }

    // MARK: static async startTetris4P
    /**
     * Starts the updating of Tetris 4P.
     * @param {{event: {organization: string, title: string, status: string, color: string}, player1: {name: string, score: string}, player2: {name: string, score: string}, player3: {name: string, score: string}, player4: {name: string, score: string}}} data The data for the view.
     * @returns {void}
     */
    static async startTetris4P(data) {
        await window.Common.loadTemplate("/js/?files=/js/home/tetris4p.js", "Tetris4P");
        await window.Common.loadTemplate("/js/?files=/views/home/tetris4p.js", "Tetris4PView");

        document.getElementById("scene").innerHTML = window.Tetris4PView.get(data);

        window.Tetris4P.start();
    }

    // MARK: static startWebsocket
    /**
     * Starts the WebSocket connection.
     * @returns {void}
     */
    static startWebsocket() {
        /** @type {WebSocket} */
        Home.ws = new WebSocket("ws://" + document.location.hostname + ":" + (document.location.port || "80") + "/");

        Home.ws.onmessage = async (ev) => {
            const data = JSON.parse(ev.data);

            switch (data.type) {
                case "reset":
                    window.location.reload();
                    break;
                case "updateSpotify":
                    if (Home.spotify) {
                        Home.startSpotify();
                    }
                    return;
                case "clearSpotify":
                    Home.spotifyTrack = void 0;
                    break;
                case "scene":
                    switch (data.scene) {
                        case "intro":
                            await Home.startIntro();
                            break;
                        case "frame":
                            await Home.startFrame();
                            break;
                        case "game":
                            await Home.startGame();
                            break;
                        case "analysis":
                            await Home.startAnalysis();
                            break;
                        case "headtohead":
                            await Home.startHeadToHead(data.banner);
                            break;
                        case "ctm":
                            await Home.startCTM();
                            break;
                        case "tetris":
                            await Home.startTetris(data.data);
                            break;
                        case "tetris2p":
                            await Home.startTetris2P(data.data);
                            break;
                        case "tetris4p":
                            await Home.startTetris4P(data.data);
                            break;
                    }
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
        } catch (err) {
        } finally {
            Home.spotifyTimeout = setTimeout(() => {
                Home.updateSpotify(interval);
            }, thisInterval || interval);
        }
    }
}

/** @type {{[x: string]: object}} */
Home.data = {
    recent: [],
    achievements: []
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
