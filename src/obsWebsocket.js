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
        if (obs) {
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

    //         #                 #    ###    #                 ##
    //         #                 #    #  #                      #
    //  ###   ###    ###  ###   ###   #  #  ##     ###   ###    #     ###  #  #
    // ##      #    #  #  #  #   #    #  #   #    ##     #  #   #    #  #  #  #
    //   ##    #    # ##  #      #    #  #   #      ##   #  #   #    # ##   # #
    // ###      ##   # #  #       ##  ###   ###   ###    ###   ###    # #    #
    //                                                   #                  #
    /**
     * Starts the display.
     * @returns {void}
     */
    static startDisplay() {
        obs.send("SetSceneItemProperties", {
            item: "Display",
            visible: true,
            bounds: {},
            scale: {},
            crop: {},
            position: {}
        });
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
     * @returns {void}
     */
    static startStreaming() {
        obs.send("StartStreaming", void 0);
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
     * @returns {void}
     */
    static startWebcam(location) {
        obs.send("SetSceneItemProperties", {
            item: `Webcam - ${location}`,
            visible: true,
            bounds: {},
            scale: {},
            crop: {},
            position: {}
        });
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
     * @returns {void}
     */
    static stopDisplay() {
        obs.send("SetSceneItemProperties", {
            item: "Display",
            visible: false,
            bounds: {},
            scale: {},
            crop: {},
            position: {}
        });
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
     * @returns {void}
     */
    static stopStreaming() {
        obs.send("StopStreaming", void 0);
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
     * @returns {void}
     */
    static stopWebcam(location) {
        obs.send("SetSceneItemProperties", {
            item: `Webcam - ${location}`,
            visible: false,
            bounds: {},
            scale: {},
            crop: {},
            position: {}
        });
    }
}

module.exports = OBSWebsocket;
