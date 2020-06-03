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

    //         #                 #    ###    #                                #
    //         #                 #    #  #                                    #
    //  ###   ###    ###  ###   ###   #  #  ##     ###    ##    ##   ###    ###
    // ##      #    #  #  #  #   #    #  #   #    ##     #     #  #  #  #  #  #
    //   ##    #    # ##  #      #    #  #   #      ##   #     #  #  #     #  #
    // ###      ##   # #  #       ##  ###   ###   ###     ##    ##   #      ###
    /**
     * Starts the Discord at the specified location.
     * @param {string} location The location to start the webcam at.
     * @returns {Promise} A promise that resolves when Discord is started.
     */
    static async startDiscord(location) {
        try {
            await obs.send("SetSceneItemProperties", {
                item: `Discord - ${location}`,
                visible: true,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } finally {}
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
        try {
            await obs.send("SetSceneItemProperties", {
                item: "Display",
                visible: true,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } finally {}
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
        try {
            await obs.send("SetSceneItemProperties", {
                item: "Audio Input Capture - Microphone",
                visible: true,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } finally {}
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
        try {
            await obs.send("StartStreaming", void 0);
        } finally {}
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
        try {
            await obs.send("SetSceneItemProperties", {
                item: `Webcam - ${location}`,
                visible: true,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } finally {}
    }

    //         #                ###    #                                #
    //         #                #  #                                    #
    //  ###   ###    ##   ###   #  #  ##     ###    ##    ##   ###    ###
    // ##      #    #  #  #  #  #  #   #    ##     #     #  #  #  #  #  #
    //   ##    #    #  #  #  #  #  #   #      ##   #     #  #  #     #  #
    // ###      ##   ##   ###   ###   ###   ###     ##    ##   #      ###
    //                    #
    /**
     * Stops the Discord at the specified location.
     * @param {string} location The location to start the webcam at.
     * @returns {Promise} A promise that resolves when Discord is stopped.
     */
    static async stopDiscord(location) {
        try {
            await obs.send("SetSceneItemProperties", {
                item: `Discord - ${location}`,
                visible: false,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } finally {}
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
        try {
            await obs.send("SetSceneItemProperties", {
                item: "Display",
                visible: false,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } finally {}
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
        try {
            await obs.send("SetSceneItemProperties", {
                item: "Audio Input Capture - Microphone",
                visible: false,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } finally {}
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
        try {
            await obs.send("StopStreaming", void 0);
        } finally {}
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
        try {
            await obs.send("SetSceneItemProperties", {
                item: `Webcam - ${location}`,
                visible: false,
                bounds: {},
                scale: {},
                crop: {},
                position: {}
            });
        } finally {}
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
        await obs.send("SetCurrentScene", {"scene-name": scene});
    }
}

module.exports = OBSWebsocket;
