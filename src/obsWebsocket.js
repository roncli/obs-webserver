const OBSWebSocketJs = require("obs-websocket-js"),

    settings = require("../settings");

/** @type {OBSWebSocketJs} */
let obs;

//   ###   ####    ###   #   #         #                           #              #
//  #   #   #  #  #   #  #   #         #                           #              #
//  #   #   #  #  #      #   #   ###   # ##    ###    ###    ###   #   #   ###   ####
//  #   #   ###    ###   # # #  #   #  ##  #  #      #   #  #   #  #  #   #   #   #
//  #   #   #  #      #  # # #  #####  #   #   ###   #   #  #      ###    #####   #
//  #   #   #  #  #   #  ## ##  #      ##  #      #  #   #  #   #  #  #   #       #  #
//   ###   ####    ###   #   #   ###   # ##   ####    ###    ###   #   #   ###     ##
/**
 * A class used for communication with OBS via websockets.
 */
class OBSWebsocket {
    //         #                 #
    //         #                 #
    //  ###   ###    ###  ###   ###
    // ##      #    #  #  #  #   #
    //   ##    #    # ##  #      #
    // ###      ##   # #  #       ##
    /**
     * Starts the OBS Websocket.
     * @returns {Promise} A promise that resolves when the OBS websocket has been started.
     */
    static async start() {
        if (obs || !settings.obswsEnabled) {
            return;
        }

        if (!obs) {
            obs = new OBSWebSocketJs();
        }

        // @ts-ignore See https://github.com/haganbmj/obs-websocket-js/issues/203
        obs.on("error", () => {
            OBSWebsocket.start();
        });

        obs.on("ConnectionClosed", () => {
            obs = null;
        });

        await obs.connect(settings.obsws);
    }

    //         #                 #     ##   ###   #  #
    //         #                 #    #  #   #    ####
    //  ###   ###    ###  ###   ###   #      #    ####
    // ##      #    #  #  #  #   #    #      #    #  #
    //   ##    #    # ##  #      #    #  #   #    #  #
    // ###      ##   # #  #       ##   ##    #    #  #
    /**
     * Starts CTM.
     * @returns {Promise} A promise that resolves when CTM is started.
     */
    static async startCTM() {
        if (!settings.obswsEnabled) {
            return;
        }

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: "CTM Stencil"},
                visible: true,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } catch (err) {} finally {}
    }

    //         #                 #    ###    #                                #
    //         #                 #    #  #                                    #
    //  ###   ###    ###  ###   ###   #  #  ##     ###    ##    ##   ###    ###
    // ##      #    #  #  #  #   #    #  #   #    ##     #     #  #  #  #  #  #
    //   ##    #    # ##  #      #    #  #   #      ##   #     #  #  #     #  #
    // ###      ##   # #  #       ##  ###   ###   ###     ##    ##   #      ###
    /**
     * Starts Discord at the specified location.
     * @param {string} location The location to start Discord at.
     * @returns {Promise} A promise that resolves when Discord is started.
     */
    static async startDiscord(location) {
        if (!settings.obswsEnabled) {
            return;
        }

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: `Discord - ${location}`},
                visible: true,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } catch (err) {} finally {}
    }

    //         #                 #    ###    #                 ##
    //         #                 #    #  #                      #
    //  ###   ###    ###  ###   ###   #  #  ##     ###   ###    #     ###  #  #
    // ##      #    #  #  #  #   #    #  #   #    ##     #  #   #    #  #  #  #
    //   ##    #    # ##  #      #    #  #   #      ##   #  #   #    # ##   # #
    // ###      ##   # #  #       ##  ###   ###   ###    ###   ###    # #    #
    //                                                   #                  #
    /**
     * Starts the display.
     * @returns {Promise} A promise that resolves when the display is started.
     */
    static async startDisplay() {
        if (!settings.obswsEnabled) {
            return;
        }

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: "Display"},
                visible: true,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } catch (err) {} finally {}
    }

    //         #                 #    #  #   #
    //         #                 #    ####
    //  ###   ###    ###  ###   ###   ####  ##     ##
    // ##      #    #  #  #  #   #    #  #   #    #
    //   ##    #    # ##  #      #    #  #   #    #
    // ###      ##   # #  #       ##  #  #  ###    ##
    /**
     * Starts the microphone.
     * @returns {Promise} A promise that resolves when the microphone is started.
     */
    static async startMic() {
        if (!settings.obswsEnabled) {
            return;
        }

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: "Audio Input Capture - Microphone"},
                visible: true,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });

            await obs.send("SetMute", {
                source: "Audio Input Capture - Microphone",
                mute: false
            });
        } catch (err) {} finally {}
    }

    //         #                 #     ##                     ##                ####   #    ##     #
    //         #                 #    #  #                     #                #            #     #
    //  ###   ###    ###  ###   ###   #  #  # #    ##   ###    #     ###  #  #  ###   ##     #    ###    ##   ###
    // ##      #    #  #  #  #   #    #  #  # #   # ##  #  #   #    #  #  #  #  #      #     #     #    # ##  #  #
    //   ##    #    # ##  #      #    #  #  # #   ##    #      #    # ##   # #  #      #     #     #    ##    #
    // ###      ##   # #  #       ##   ##    #     ##   #     ###    # #    #   #     ###   ###     ##   ##   #
    //                                                                     #
    /**
     * Starts the overlay filter for the stinger.
     * @returns {Promise} A promise that resolves when the filter is started.
     */
    static async startOverlayFilter() {
        if (!settings.obswsEnabled) {
            return;
        }

        try {
            await obs.send("SetSourceFilterVisibility", {
                sourceName: "Browser - Overlay",
                filterName: "Chroma Key",
                filterEnabled: true
            });
        } catch (err) {} finally {}
    }

    //         #                 #    ###                 #
    //         #                 #    #  #                #
    //  ###   ###    ###  ###   ###   #  #   ##    ###   ###   ###    ##    ###  # #    ###
    // ##      #    #  #  #  #   #    ###   # ##  ##      #    #  #  # ##  #  #  ####  ##
    //   ##    #    # ##  #      #    # #   ##      ##    #    #     ##    # ##  #  #    ##
    // ###      ##   # #  #       ##  #  #   ##   ###      ##  #      ##    # #  #  #  ###
    /**
     * Starts the restreams.
     * @returns {Promise} A promise that resolves when the restreams are started.
     */
    static async startRestreams() {
        if (!settings.obswsEnabled) {
            return;
        }

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: "Restreams"},
                visible: true,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } catch (err) {} finally {}
    }

    //         #                 #     ##    #                             #
    //         #                 #    #  #   #
    //  ###   ###    ###  ###   ###    #    ###   ###    ##    ###  # #   ##    ###    ###
    // ##      #    #  #  #  #   #      #    #    #  #  # ##  #  #  ####   #    #  #  #  #
    //   ##    #    # ##  #      #    #  #   #    #     ##    # ##  #  #   #    #  #   ##
    // ###      ##   # #  #       ##   ##     ##  #      ##    # #  #  #  ###   #  #  #
    //                                                                                 ###
    /**
     * Starts OBS streaming.
     * @returns {Promise} A promise that resolves when streaming starts.
     */
    static async startStreaming() {
        if (!settings.obswsEnabled) {
            return;
        }

        try {
            await obs.send("StartStreaming", void 0);
        } catch (err) {} finally {}
    }

    //         #                 #    ###          #           #            ##   ###    #     ##
    //         #                 #     #           #                       #  #  #  #  ##    #  #
    //  ###   ###    ###  ###   ###    #     ##   ###   ###   ##     ###      #  #  #   #       #
    // ##      #    #  #  #  #   #     #    # ##   #    #  #   #    ##       #   ###    #      #
    //   ##    #    # ##  #      #     #    ##     #    #      #      ##    #    #      #     #
    // ###      ##   # #  #       ##   #     ##     ##  #     ###   ###    ####  #     ###   ####
    /**
     * Starts the Tetris scene for players 1 and 2.
     * @returns {Promise} A promise that resolves when the scene is started.
     */
    static async startTetris2P12() {
        if (!settings.obswsEnabled) {
            return;
        }

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: "Tetris - 2P - 1 & 2"},
                visible: true,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } catch (err) {} finally {}

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: "Tetris - 2P - 3 & 4"},
                visible: false,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } catch (err) {} finally {}

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: "Tetris - 4P"},
                visible: false,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } catch (err) {} finally {}
    }

    //         #                 #    ###          #           #            ##   ###   ####    #
    //         #                 #     #           #                       #  #  #  #     #   ##
    //  ###   ###    ###  ###   ###    #     ##   ###   ###   ##     ###      #  #  #   ##   # #
    // ##      #    #  #  #  #   #     #    # ##   #    #  #   #    ##       #   ###      #  ####
    //   ##    #    # ##  #      #     #    ##     #    #      #      ##    #    #     #  #    #
    // ###      ##   # #  #       ##   #     ##     ##  #     ###   ###    ####  #      ##     #
    /**
     * Starts the Tetris scene for players 1 and 2.
     * @returns {Promise} A promise that resolves when the scene is started.
     */
    static async startTetris2P34() {
        if (!settings.obswsEnabled) {
            return;
        }

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: "Tetris - 2P - 1 & 2"},
                visible: false,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } catch (err) {} finally {}

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: "Tetris - 2P - 3 & 4"},
                visible: true,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } catch (err) {} finally {}

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: "Tetris - 4P"},
                visible: false,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } catch (err) {} finally {}
    }

    //         #                 #    ###          #           #             #   ###
    //         #                 #     #           #                        ##   #  #
    //  ###   ###    ###  ###   ###    #     ##   ###   ###   ##     ###   # #   #  #
    // ##      #    #  #  #  #   #     #    # ##   #    #  #   #    ##     ####  ###
    //   ##    #    # ##  #      #     #    ##     #    #      #      ##     #   #
    // ###      ##   # #  #       ##   #     ##     ##  #     ###   ###      #   #
    /**
     * Starts the Tetris scene for four players.
     * @returns {Promise} A promise that resolves when the scene is started.
     */
    static async startTetris4P() {
        if (!settings.obswsEnabled) {
            return;
        }

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: "Tetris - 2P - 1 & 2"},
                visible: false,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } catch (err) {} finally {}

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: "Tetris - 2P - 3 & 4"},
                visible: false,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } catch (err) {} finally {}

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: "Tetris - 4P"},
                visible: true,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } catch (err) {} finally {}
    }

    //         #                 #    #  #        #
    //         #                 #    #  #        #
    //  ###   ###    ###  ###   ###   #  #   ##   ###    ##    ###  # #
    // ##      #    #  #  #  #   #    ####  # ##  #  #  #     #  #  ####
    //   ##    #    # ##  #      #    ####  ##    #  #  #     # ##  #  #
    // ###      ##   # #  #       ##  #  #   ##   ###    ##    # #  #  #
    /**
     * Starts the webcam at the specified location.
     * @param {string} location The location to start the webcam at.
     * @returns {Promise} A promise that resolves when the webcam is started.
     */
    static async startWebcam(location) {
        if (!settings.obswsEnabled) {
            return;
        }

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: `Webcam - ${location}`},
                visible: true,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } catch (err) {} finally {}
    }

    //         #                 ##   ###   #  #
    //         #                #  #   #    ####
    //  ###   ###    ##   ###   #      #    ####
    // ##      #    #  #  #  #  #      #    #  #
    //   ##    #    #  #  #  #  #  #   #    #  #
    // ###      ##   ##   ###    ##    #    #  #
    //                    #
    /**
     * Stops CTM.
     * @returns {Promise} A promise that resolves when CTM is stopped.
     */
    static async stopCTM() {
        if (!settings.obswsEnabled) {
            return;
        }

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: "CTM Stencil"},
                visible: false,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } catch (err) {} finally {}
    }

    //         #                ###    #                                #
    //         #                #  #                                    #
    //  ###   ###    ##   ###   #  #  ##     ###    ##    ##   ###    ###
    // ##      #    #  #  #  #  #  #   #    ##     #     #  #  #  #  #  #
    //   ##    #    #  #  #  #  #  #   #      ##   #     #  #  #     #  #
    // ###      ##   ##   ###   ###   ###   ###     ##    ##   #      ###
    //                    #
    /**
     * Stops Discord at the specified location.
     * @param {string} location The location to start Discord at.
     * @returns {Promise} A promise that resolves when Discord is stopped.
     */
    static async stopDiscord(location) {
        if (!settings.obswsEnabled) {
            return;
        }

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: `Discord - ${location}`},
                visible: false,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } catch (err) {} finally {}
    }

    //         #                ###    #                 ##
    //         #                #  #                      #
    //  ###   ###    ##   ###   #  #  ##     ###   ###    #     ###  #  #
    // ##      #    #  #  #  #  #  #   #    ##     #  #   #    #  #  #  #
    //   ##    #    #  #  #  #  #  #   #      ##   #  #   #    # ##   # #
    // ###      ##   ##   ###   ###   ###   ###    ###   ###    # #    #
    //                    #                        #                  #
    /**
     * Stops the display.
     * @returns {Promise} A promise that resolves when the display is stopped.
     */
    static async stopDisplay() {
        if (!settings.obswsEnabled) {
            return;
        }

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: "Display"},
                visible: false,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } catch (err) {} finally {}
    }

    //         #                #  #   #
    //         #                ####
    //  ###   ###    ##   ###   ####  ##     ##
    // ##      #    #  #  #  #  #  #   #    #
    //   ##    #    #  #  #  #  #  #   #    #
    // ###      ##   ##   ###   #  #  ###    ##
    //                    #
    /**
     * Stops the microphone.
     * @returns {Promise} A promise that resolves when the microphone is stopped.
     */
    static async stopMic() {
        if (!settings.obswsEnabled) {
            return;
        }

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: "Audio Input Capture - Microphone"},
                visible: false,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } catch (err) {} finally {}
    }

    //         #                 ##                     ##                ####   #    ##     #
    //         #                #  #                     #                #            #     #
    //  ###   ###    ##   ###   #  #  # #    ##   ###    #     ###  #  #  ###   ##     #    ###    ##   ###
    // ##      #    #  #  #  #  #  #  # #   # ##  #  #   #    #  #  #  #  #      #     #     #    # ##  #  #
    //   ##    #    #  #  #  #  #  #  # #   ##    #      #    # ##   # #  #      #     #     #    ##    #
    // ###      ##   ##   ###    ##    #     ##   #     ###    # #    #   #     ###   ###     ##   ##   #
    //                    #                                          #
    /**
     * Stops the overlay filter for the stinger.
     * @returns {Promise} A promise that resolves when the filter is stopped.
     */
    static async stopOverlayFilter() {
        if (!settings.obswsEnabled) {
            return;
        }

        try {
            await obs.send("SetSourceFilterVisibility", {
                sourceName: "Browser - Overlay",
                filterName: "Chroma Key",
                filterEnabled: false
            });
        } catch (err) {} finally {}
    }

    //         #                ###                 #
    //         #                #  #                #
    //  ###   ###    ##   ###   #  #   ##    ###   ###   ###    ##    ###  # #    ###
    // ##      #    #  #  #  #  ###   # ##  ##      #    #  #  # ##  #  #  ####  ##
    //   ##    #    #  #  #  #  # #   ##      ##    #    #     ##    # ##  #  #    ##
    // ###      ##   ##   ###   #  #   ##   ###      ##  #      ##    # #  #  #  ###
    //                    #
    /**
     * Stops the restreams.
     * @returns {Promise} A promise that resolves when the restreams are stopped.
     */
    static async stopRestreams() {
        if (!settings.obswsEnabled) {
            return;
        }

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: "Restreams"},
                visible: false,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } catch (err) {} finally {}
    }

    //         #                 ##    #                             #
    //         #                #  #   #
    //  ###   ###    ##   ###    #    ###   ###    ##    ###  # #   ##    ###    ###
    // ##      #    #  #  #  #    #    #    #  #  # ##  #  #  ####   #    #  #  #  #
    //   ##    #    #  #  #  #  #  #   #    #     ##    # ##  #  #   #    #  #   ##
    // ###      ##   ##   ###    ##     ##  #      ##    # #  #  #  ###   #  #  #
    //                    #                                                      ###
    /**
     * Stops OBS streaming.
     * @returns {Promise} A promise that resolves when OBS stops streaming.
     */
    static async stopStreaming() {
        if (!settings.obswsEnabled) {
            return;
        }

        try {
            await obs.send("StopStreaming", void 0);
        } catch (err) {} finally {}
    }

    //         #                ###          #           #
    //         #                 #           #
    //  ###   ###    ##   ###    #     ##   ###   ###   ##     ###
    // ##      #    #  #  #  #   #    # ##   #    #  #   #    ##
    //   ##    #    #  #  #  #   #    ##     #    #      #      ##
    // ###      ##   ##   ###    #     ##     ##  #     ###   ###
    //                    #
    /**
     * Stops the tetris scenes.
     * @returns {Promise} A promise that resolves when the tetris scenes are stopped.
     */
    static async stopTetris() {
        if (!settings.obswsEnabled) {
            return;
        }

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: "Tetris - 2P - 1 & 2"},
                visible: false,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } catch (err) {} finally {}

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: "Tetris - 2P - 3 & 4"},
                visible: false,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } catch (err) {} finally {}

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: "Tetris - 4P"},
                visible: false,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } catch (err) {} finally {}
    }

    //         #                #  #        #
    //         #                #  #        #
    //  ###   ###    ##   ###   #  #   ##   ###    ##    ###  # #
    // ##      #    #  #  #  #  ####  # ##  #  #  #     #  #  ####
    //   ##    #    #  #  #  #  ####  ##    #  #  #     # ##  #  #
    // ###      ##   ##   ###   #  #   ##   ###    ##    # #  #  #
    //                    #
    /**
     * Stops the webcam at the specified location.
     * @param {string} location The location to stop the webcam at.
     * @returns {Promise} A promise that resolves when the webcam is stopped.
     */
    static async stopWebcam(location) {
        if (!settings.obswsEnabled) {
            return;
        }

        try {
            await obs.send("SetSceneItemProperties", {
                item: {name: `Webcam - ${location}`},
                visible: false,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } catch (err) {} finally {}
    }

    //               #     #          #      ##
    //                     #          #     #  #
    //  ###   #  #  ##    ###    ##   ###    #     ##    ##   ###    ##
    // ##     #  #   #     #    #     #  #    #   #     # ##  #  #  # ##
    //   ##   ####   #     #    #     #  #  #  #  #     ##    #  #  ##
    // ###    ####  ###     ##   ##   #  #   ##    ##    ##   #  #   ##
    /**
     * Switches to the specified scene.
     * @param {string} scene The scene to switch to
     * @returns {Promise} A promise that resolves when the scene has been switched.
     */
    static async switchScene(scene) {
        if (!settings.obswsEnabled) {
            return;
        }

        try {
            await obs.send("SetCurrentScene", {"scene-name": scene});
        } catch (err) {} finally {}
    }
}

module.exports = OBSWebsocket;
