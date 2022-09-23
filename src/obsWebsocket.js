const OBSWebSocketJs = require("obs-websocket-js").default,

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
    //              #    ###    #                ###      #
    //              #     #     #                 #       #
    //  ###   ##   ###    #    ###    ##   # #    #     ###
    // #  #  # ##   #     #     #    # ##  ####   #    #  #
    //  ##   ##     #     #     #    ##    #  #   #    #  #
    // #      ##     ##  ###     ##   ##   #  #  ###    ###
    //  ###
    /**
     * Gets the item ID by source name.
     * @param {string} sceneName The name of the scene.
     * @param {string} sourceName The name of the source.
     * @returns {Promise<number>} The source's item ID.
     */
    static async getItemId(sceneName, sourceName) {
        return (await obs.call("GetSceneItemId", {
            sceneName,
            sourceName
        })).sceneItemId;
    }

    //  #           #  #   #            #    #     ##
    //              #  #                     #      #
    // ##     ###   #  #  ##     ###   ##    ###    #     ##
    //  #    ##     #  #   #    ##      #    #  #   #    # ##
    //  #      ##    ##    #      ##    #    #  #   #    ##
    // ###   ###     ##   ###   ###    ###   ###   ###    ##
    /**
     * Determines if a source is visible.
     * @param {string} sceneName The scene name.
     * @param {string} sourceName The source name.
     * @returns {Promise<boolean>} A promise that returns whether the source is visible.
     */
    static async isVisible(sceneName, sourceName) {
        return (await obs.call("GetSceneItemEnabled", {
            sceneName,
            sceneItemId: await OBSWebsocket.getItemId(sceneName, sourceName)
        })).sceneItemEnabled;
    }

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

        // @ts-ignore Awaiting PR https://github.com/obs-websocket-community-projects/obs-websocket-js/pull/217
        obs.on("error", () => {
            OBSWebsocket.start();
        });

        obs.on("ConnectionClosed", () => {
            obs = null;
        });

        await obs.connect(settings.obsws.address, settings.obsws.password);
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
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", "CTM Stencil"),
                sceneItemEnabled: true
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
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", `Discord - ${location}`),
                sceneItemEnabled: true
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
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", "Display"),
                sceneItemEnabled: true
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
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", "Audio Input Capture - Microphone"),
                sceneItemEnabled: true
            });

            await obs.call("SetInputMute", {
                inputName: "Audio Input Capture - Microphone",
                inputMuted: false
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
            await obs.call("SetSourceFilterEnabled", {
                sourceName: "Browser - Overlay",
                filterName: "Chroma Key",
                filterEnabled: true
            });
        } catch (err) {} finally {}
    }

    //         #                 #    ###               ##
    //         #                 #    #  #               #
    //  ###   ###    ###  ###   ###   #  #   ##   ###    #     ###  #  #
    // ##      #    #  #  #  #   #    ###   # ##  #  #   #    #  #  #  #
    //   ##    #    # ##  #      #    # #   ##    #  #   #    # ##   # #
    // ###      ##   # #  #       ##  #  #   ##   ###   ###    # #    #
    //                                            #                  #
    /**
     * Starts the replay and the filter for the live scene.
     * @param {string} source The name of the source.
     * @returns {Promise} A promise that resolves when the replay is started.
     */
    static async startReplay(source) {
        if (!settings.obswsEnabled) {
            return;
        }

        try {
            await obs.call("SetSourceFilterEnabled", {
                sourceName: source,
                filterName: "Color Correction",
                filterEnabled: true
            });
            await obs.call("SetSceneItemEnabled", {
                sceneName: "Restreams",
                sceneItemId: await OBSWebsocket.getItemId("Restreams", `${source} - Replay`),
                sceneItemEnabled: true
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
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", "Restreams"),
                sceneItemEnabled: true
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
            await obs.call("StartStream");
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
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", "Tetris - 2P - 1 & 2"),
                sceneItemEnabled: true
            });
        } catch (err) {} finally {}

        try {
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", "Tetris - 2P - 3 & 4"),
                sceneItemEnabled: false
            });
        } catch (err) {} finally {}

        try {
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", "Tetris - 4P"),
                sceneItemEnabled: false
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
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", "Tetris - 2P - 1 & 2"),
                sceneItemEnabled: false
            });
        } catch (err) {} finally {}

        try {
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", "Tetris - 2P - 3 & 4"),
                sceneItemEnabled: true
            });
        } catch (err) {} finally {}

        try {
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", "Tetris - 4P"),
                sceneItemEnabled: false
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
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", "Tetris - 2P - 1 & 2"),
                sceneItemEnabled: false
            });
        } catch (err) {} finally {}

        try {
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", "Tetris - 2P - 3 & 4"),
                sceneItemEnabled: false
            });
        } catch (err) {} finally {}

        try {
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", "Tetris - 4P"),
                sceneItemEnabled: true
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
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", `Webcam - ${location}`),
                sceneItemEnabled: true
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
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", "CTM Stencil"),
                sceneItemEnabled: false
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
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", `Discord - ${location}`),
                sceneItemEnabled: false
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
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", "Display"),
                sceneItemEnabled: false
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
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", "Audio Input Capture - Microphone"),
                sceneItemEnabled: false
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
            await obs.call("SetSourceFilterEnabled", {
                sourceName: "Browser - Overlay",
                filterName: "Chroma Key",
                filterEnabled: false
            });
        } catch (err) {} finally {}
    }

    //         #                ###               ##
    //         #                #  #               #
    //  ###   ###    ##   ###   #  #   ##   ###    #     ###  #  #
    // ##      #    #  #  #  #  ###   # ##  #  #   #    #  #  #  #
    //   ##    #    #  #  #  #  # #   ##    #  #   #    # ##   # #
    // ###      ##   ##   ###   #  #   ##   ###   ###    # #    #
    //                    #                 #                  #
    /**
     * Stops the replay and the filter for the live scene.
     * @param {string} source The name of the source.
     * @returns {Promise} A promise that resolves when the replay is stopped.
     */
    static async stopReplay(source) {
        if (!settings.obswsEnabled) {
            return;
        }

        try {
            await obs.call("SetSourceFilterEnabled", {
                sourceName: source,
                filterName: "Color Correction",
                filterEnabled: false
            });
            await obs.call("SetSceneItemEnabled", {
                sceneName: "Restreams",
                sceneItemId: await OBSWebsocket.getItemId("Restreams", `${source} - Replay`),
                sceneItemEnabled: false
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
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", "Restreams"),
                sceneItemEnabled: false
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
            await obs.call("StopStream");
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
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", "Tetris - 2P - 1 & 2"),
                sceneItemEnabled: false
            });
        } catch (err) {} finally {}

        try {
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", "Tetris - 2P - 3 & 4"),
                sceneItemEnabled: false
            });
        } catch (err) {} finally {}

        try {
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", "Tetris - 4P"),
                sceneItemEnabled: false
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
            await obs.call("SetSceneItemEnabled", {
                sceneName: "roncli Gaming",
                sceneItemId: await OBSWebsocket.getItemId("roncli Gaming", `Webcam - ${location}`),
                sceneItemEnabled: false
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
            await obs.call("SetCurrentProgramScene", {sceneName: scene});
        } catch (err) {} finally {}
    }
}

module.exports = OBSWebsocket;
