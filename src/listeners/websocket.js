/**
 * @typedef {import("ws").Data} WebSocket.Data
 */

const OBSWebsocket = require("../obsWebsocket"),
    Websocket = require("../websocket");

//  #   #         #                           #              #     #        #            #
//  #   #         #                           #              #     #                     #
//  #   #   ###   # ##    ###    ###    ###   #   #   ###   ####   #       ##     ###   ####    ###   # ##    ###   # ##
//  # # #  #   #  ##  #  #      #   #  #   #  #  #   #   #   #     #        #    #       #     #   #  ##  #  #   #  ##  #
//  # # #  #####  #   #   ###   #   #  #      ###    #####   #     #        #     ###    #     #####  #   #  #####  #
//  ## ##  #      ##  #      #  #   #  #   #  #  #   #       #  #  #        #        #   #  #  #      #   #  #      #
//  #   #   ###   # ##   ####    ###    ###   #   #   ###     ##   #####   ###   ####     ##    ###   #   #   ###   #
/**
 * A class that handles listening to Websocket events.
 */
class WebsocketListener {
    //        ##
    //         #
    //  ###    #     ##    ##   ###
    // ##      #    # ##  # ##  #  #
    //   ##    #    ##    ##    #  #
    // ###    ###    ##    ##   ###
    //                          #
    /**
     * Sleeps the thread for the specified time.
     * @param {number} ms The number of milliseconds to sleep for.
     * @returns {Promise} A promise that resolves when the sleep period has completed.
     */
    static sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    // # #    ##    ###    ###    ###   ###   ##
    // ####  # ##  ##     ##     #  #  #  #  # ##
    // #  #  ##      ##     ##   # ##   ##   ##
    // #  #   ##   ###    ###     # #  #      ##
    //                                  ###
    /**
     * Handles when a message is received by the websocket.
     * @param {object} data The message event.
     * @returns {Promise} A promise that resolves when the message is handled.
     */
    static async message(data) {
        console.log("Incoming to server.", data);

        switch (data.type) {
            case "action":
                Websocket.broadcast({
                    type: "overlay",
                    data: {
                        type: data.data.overlay,
                        soundPath: data.data.soundPath
                    }
                });
                break;
            case "transition":
                await OBSWebsocket.start();

                switch (data.scene) {
                    case "Start Stream":
                        {
                            WebsocketListener.data.phase = "intro";

                            let until = Date.now();

                            OBSWebsocket.stopWebcam("frame");
                            OBSWebsocket.stopWebcam("game");
                            OBSWebsocket.stopDisplay();
                            // OBSWebsocket.startStreaming();

                            Websocket.broadcast({
                                type: "scene",
                                scene: "intro"
                            });
                            until += 5000;
                            await WebsocketListener.sleep(until - Date.now());

                            Websocket.broadcast({
                                type: "phase",
                                phase: "intro"
                            });
                            until += 1250;
                            await WebsocketListener.sleep(until - Date.now());

                            Websocket.broadcast({
                                type: "overlay",
                                data: {
                                    soundPath: "/media/boom-bitches.ogg"
                                }
                            });
                            until += 58750;
                            await WebsocketListener.sleep(until - Date.now());

                            Websocket.broadcast({
                                type: "overlay",
                                data: {
                                    type: "stinger"
                                }
                            });
                            until += 425;
                            await WebsocketListener.sleep(until - Date.now());

                            Websocket.broadcast({
                                type: "scene",
                                scene: "frame"
                            });
                            until += 200;
                            await WebsocketListener.sleep(until - Date.now());

                            Websocket.broadcast({
                                type: "phase",
                                phase: "intro"
                            });
                            until += 625;
                            await WebsocketListener.sleep(until - Date.now());

                            Websocket.broadcast({
                                type: "phase",
                                phase: "trailer"
                            });
                            until += 20000;
                            await WebsocketListener.sleep(until - Date.now());

                            Websocket.broadcast({
                                type: "phase",
                                phase: "trailer-done"
                            });
                            until += 5000;
                            await WebsocketListener.sleep(until - Date.now());

                            OBSWebsocket.startWebcam("frame");
                        }

                        WebsocketListener.data.phase = "webcam";

                        break;
                    case "Webcam":
                        switch (WebsocketListener.data.phase) {
                            case "intro":
                            case "ending":
                            case "webcam":
                                return;
                            case "brb":
                                OBSWebsocket.startWebcam("frame");
                                Websocket.broadcast({
                                    type: "phase",
                                    phase: "webcam"
                                });
                                break;
                            default:
                                {
                                    let until = Date.now();

                                    Websocket.broadcast({
                                        type: "overlay",
                                        data: {
                                            type: "stinger"
                                        }
                                    });
                                    until += 425;
                                    await WebsocketListener.sleep(until - Date.now());

                                    Websocket.broadcast({
                                        type: "scene",
                                        scene: "frame"
                                    });
                                    until += 200;
                                    await WebsocketListener.sleep(until - Date.now());

                                    Websocket.broadcast({
                                        type: "phase",
                                        phase: "webcam"
                                    });

                                    OBSWebsocket.stopWebcam("game");
                                    OBSWebsocket.stopDisplay();
                                    OBSWebsocket.startWebcam("frame");
                                }
                                break;
                        }
                        WebsocketListener.data.phase = "webcam";
                        break;
                    case "Game":
                        switch (WebsocketListener.data.phase) {
                            case "intro":
                            case "ending":
                            case "game":
                                return;
                            default:
                                {
                                    let until = Date.now();

                                    Websocket.broadcast({
                                        type: "overlay",
                                        data: {
                                            type: "stinger"
                                        }
                                    });
                                    until += 625;
                                    await WebsocketListener.sleep(until - Date.now());

                                    Websocket.broadcast({
                                        type: "scene",
                                        scene: "game"
                                    });
                                    OBSWebsocket.stopWebcam("frame");
                                    OBSWebsocket.startDisplay();
                                    OBSWebsocket.startWebcam("game");
                                }
                                break;
                        }
                        WebsocketListener.data.phase = "game";
                        break;
                    case "BRB":
                        switch (WebsocketListener.data.phase) {
                            case "intro":
                            case "ending":
                            case "brb":
                                return;
                            case "webcam":
                                OBSWebsocket.stopWebcam("frame");
                                Websocket.broadcast({
                                    type: "phase",
                                    phase: "brb"
                                });
                                break;
                            default:
                                {
                                    let until = Date.now();

                                    Websocket.broadcast({
                                        type: "overlay",
                                        data: {
                                            type: "stinger"
                                        }
                                    });
                                    until += 425;
                                    await WebsocketListener.sleep(until - Date.now());

                                    Websocket.broadcast({
                                        type: "scene",
                                        scene: "frame"
                                    });
                                    until += 200;
                                    await WebsocketListener.sleep(until - Date.now());

                                    Websocket.broadcast({
                                        type: "phase",
                                        phase: "brb"
                                    });
                                    OBSWebsocket.stopWebcam("game");
                                    OBSWebsocket.stopDisplay();
                                    OBSWebsocket.stopWebcam("frame");
                                }
                                break;
                        }
                        WebsocketListener.data.phase = "brb";
                        break;
                    case "End Stream":
                        switch (WebsocketListener.data.phase) {
                            case "intro":
                            case "ending":
                                return;
                            default:
                                WebsocketListener.data.phase = "ending";

                                break;
                        }
                        WebsocketListener.data.phase = "";
                        break;
                    default:
                        Websocket.broadcast({
                            type: "scene",
                            scene: data.scene
                        });
                        break;
                }
        }
    }
}

WebsocketListener.data = {
    phase: ""
};

module.exports = WebsocketListener;
