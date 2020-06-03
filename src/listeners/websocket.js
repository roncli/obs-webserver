/**
 * @typedef {import("ws").Data} WebSocket.Data
 */

const ConfigFile = require("../configFile"),
    Log = require("../logging/log"),
    Notifications = require("../notifications"),
    OBSWebsocket = require("../obsWebsocket"),
    Spotify = require("../spotify"),
    Twitch = require("../twitch"),
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
        // console.log("Incoming to server.", data);

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
            case "discord":
                if (WebsocketListener.data.phase === "game") {
                    await OBSWebsocket.startDiscord("game");
                }
                Websocket.broadcast(data);
                break;
            case "reset":
                WebsocketListener.reset = true;
                Websocket.broadcast(data);
                break;
            case "update-twitch":
                {
                    const roncliGaming = ConfigFile.get("roncliGaming"),
                        title = roncliGaming.title.replace(/\n/g, " - "),
                        game = roncliGaming.game;

                    await Twitch.setStreamInfo(title, game);
                }
                break;
            case "music":
                switch (data.data.command) {
                    case "play":
                        {
                            let okToSend = false;

                            try {
                                await Spotify.getSpotifyToken();
                                await Spotify.spotify.setVolume(data.data.volume);
                                await Spotify.spotify.play({uris: data.data.track ? [data.data.track] : void 0, "context_uri": data.data.uri});

                                okToSend = true;
                            } catch (err) {
                                if (err.statusCode !== 404) {
                                    Log.exception("There was an error playing Spotify.", err);
                                }
                            }

                            if (okToSend) {
                                Websocket.broadcast({
                                    type: "updateSpotify"
                                });
                            }
                        }

                        break;
                    case "stop":
                        {
                            let okToSend = false;

                            try {
                                await Spotify.getSpotifyToken();
                                await Spotify.spotify.pause();

                                okToSend = true;
                            } catch (err) {
                                if (err.statusCode === 403) {
                                    // Forbidden from the Spotify API means that the player is already paused, which is fine.

                                    okToSend = true;
                                } else {
                                    Log.exception("There was an error pausing Spotify.", err);
                                }
                            }

                            if (okToSend) {
                                Websocket.broadcast({
                                    type: "clearSpotify"
                                });
                            }
                        }
                        break;
                }
                break;
            case "transition":
                await OBSWebsocket.start();

                switch (data.scene) {
                    case "Start Stream":
                        {
                            WebsocketListener.data.phase = "intro";

                            let until = Date.now();

                            Notifications.stop();
                            await OBSWebsocket.switchScene("roncli Gaming");
                            OBSWebsocket.stopWebcam("frame");
                            OBSWebsocket.stopWebcam("game");
                            OBSWebsocket.stopDisplay();
                            OBSWebsocket.stopDiscord("game");
                            until += 5000;
                            await WebsocketListener.sleep(until - Date.now());
                            if (WebsocketListener.reset) {
                                WebsocketListener.reset = false;
                                return;
                            }

                            // OBSWebsocket.startStreaming();

                            Websocket.broadcast({
                                type: "scene",
                                scene: "intro"
                            });
                            until += 5000;
                            await WebsocketListener.sleep(until - Date.now());
                            if (WebsocketListener.reset) {
                                WebsocketListener.reset = false;
                                return;
                            }

                            Websocket.broadcast({
                                type: "phase",
                                phase: "intro"
                            });
                            until += 1250;
                            await WebsocketListener.sleep(until - Date.now());
                            if (WebsocketListener.reset) {
                                WebsocketListener.reset = false;
                                return;
                            }

                            Websocket.broadcast({
                                type: "overlay",
                                data: {
                                    soundPath: "/media/boom-bitches.ogg"
                                }
                            });
                            until += 58700;
                            await WebsocketListener.sleep(until - Date.now());
                            if (WebsocketListener.reset) {
                                WebsocketListener.reset = false;
                                return;
                            }

                            Websocket.broadcast({
                                type: "overlay",
                                data: {
                                    type: "stinger"
                                }
                            });
                            until += 475;
                            await WebsocketListener.sleep(until - Date.now());
                            if (WebsocketListener.reset) {
                                WebsocketListener.reset = false;
                                return;
                            }

                            Websocket.broadcast({
                                type: "scene",
                                scene: "frame"
                            });
                            until += 200;
                            await WebsocketListener.sleep(until - Date.now());
                            if (WebsocketListener.reset) {
                                WebsocketListener.reset = false;
                                return;
                            }

                            Websocket.broadcast({
                                type: "phase",
                                phase: "intro"
                            });
                            until += 625;
                            await WebsocketListener.sleep(until - Date.now());
                            if (WebsocketListener.reset) {
                                WebsocketListener.reset = false;
                                return;
                            }

                            Websocket.broadcast({
                                type: "phase",
                                phase: "trailer"
                            });
                            until += 20000;
                            await WebsocketListener.sleep(until - Date.now());
                            if (WebsocketListener.reset) {
                                WebsocketListener.reset = false;
                                return;
                            }

                            OBSWebsocket.startMic();
                            Websocket.broadcast({
                                type: "phase",
                                phase: "trailer-done"
                            });
                            until += 5000;
                            await WebsocketListener.sleep(until - Date.now());
                            if (WebsocketListener.reset) {
                                WebsocketListener.reset = false;
                                return;
                            }

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
                                Notifications.stop();
                                OBSWebsocket.startMic();
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
                                    if (WebsocketListener.reset) {
                                        WebsocketListener.reset = false;
                                        return;
                                    }

                                    Websocket.broadcast({
                                        type: "scene",
                                        scene: "frame"
                                    });
                                    until += 200;
                                    await WebsocketListener.sleep(until - Date.now());
                                    if (WebsocketListener.reset) {
                                        WebsocketListener.reset = false;
                                        return;
                                    }

                                    Websocket.broadcast({
                                        type: "phase",
                                        phase: "webcam"
                                    });

                                    Notifications.stop();
                                    OBSWebsocket.startMic();
                                    OBSWebsocket.startWebcam("frame");
                                    OBSWebsocket.stopWebcam("game");
                                    OBSWebsocket.stopDisplay();
                                    OBSWebsocket.stopDiscord("game");
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
                                    if (WebsocketListener.reset) {
                                        WebsocketListener.reset = false;
                                        return;
                                    }

                                    Websocket.broadcast({
                                        type: "scene",
                                        scene: "game"
                                    });
                                    Notifications.start();
                                    OBSWebsocket.startMic();
                                    OBSWebsocket.startWebcam("game");
                                    OBSWebsocket.stopWebcam("frame");
                                    OBSWebsocket.startDisplay();
                                    OBSWebsocket.stopDiscord("game");
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
                                Notifications.stop();
                                OBSWebsocket.stopMic();
                                OBSWebsocket.stopWebcam("frame");
                                Websocket.broadcast({
                                    type: "phase",
                                    phase: "brb"
                                });
                                break;
                            default:
                                {
                                    let until = Date.now();

                                    Notifications.stop();
                                    Websocket.broadcast({
                                        type: "overlay",
                                        data: {
                                            type: "stinger"
                                        }
                                    });
                                    until += 425;
                                    await WebsocketListener.sleep(until - Date.now());
                                    if (WebsocketListener.reset) {
                                        WebsocketListener.reset = false;
                                        return;
                                    }

                                    Websocket.broadcast({
                                        type: "scene",
                                        scene: "frame"
                                    });
                                    until += 200;
                                    await WebsocketListener.sleep(until - Date.now());
                                    if (WebsocketListener.reset) {
                                        WebsocketListener.reset = false;
                                        return;
                                    }

                                    Websocket.broadcast({
                                        type: "phase",
                                        phase: "brb"
                                    });
                                    OBSWebsocket.stopMic();
                                    OBSWebsocket.stopWebcam("game");
                                    OBSWebsocket.stopDisplay();
                                    OBSWebsocket.stopWebcam("frame");
                                    OBSWebsocket.stopDiscord("game");
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
                                {
                                    let until = Date.now();

                                    Notifications.stop();
                                    WebsocketListener.data.phase = "ending";

                                    if (["brb", "webcam"].indexOf(WebsocketListener.data.phase) === -1) {
                                        Websocket.broadcast({
                                            type: "overlay",
                                            data: {
                                                type: "stinger"
                                            }
                                        });
                                        until += 425;
                                        await WebsocketListener.sleep(until - Date.now());
                                        if (WebsocketListener.reset) {
                                            WebsocketListener.reset = false;
                                            return;
                                        }

                                        OBSWebsocket.stopDisplay();
                                        OBSWebsocket.stopDiscord("game");
                                        OBSWebsocket.startWebcam("frame");
                                        OBSWebsocket.stopWebcam("game");
                                        Websocket.broadcast({
                                            type: "scene",
                                            scene: "frame"
                                        });
                                        until += 200;
                                        await WebsocketListener.sleep(until - Date.now());
                                        if (WebsocketListener.reset) {
                                            WebsocketListener.reset = false;
                                            return;
                                        }
                                    } else {
                                        OBSWebsocket.startWebcam("frame");
                                    }

                                    OBSWebsocket.startMic();
                                    Websocket.broadcast({
                                        type: "phase",
                                        phase: "webcam"
                                    });
                                    until += 1250;
                                    await WebsocketListener.sleep(until - Date.now());
                                    if (WebsocketListener.reset) {
                                        WebsocketListener.reset = false;
                                        return;
                                    }

                                    Websocket.broadcast({
                                        type: "overlay",
                                        data: {
                                            soundPath: "/media/boom-bitches-ending.ogg"
                                        }
                                    });
                                    until += 18750;
                                    await WebsocketListener.sleep(until - Date.now());
                                    if (WebsocketListener.reset) {
                                        WebsocketListener.reset = false;
                                        return;
                                    }

                                    OBSWebsocket.stopMic();
                                    Websocket.broadcast({
                                        type: "overlay",
                                        data: {
                                            type: "stinger"
                                        }
                                    });
                                    until += 425;
                                    await WebsocketListener.sleep(until - Date.now());
                                    if (WebsocketListener.reset) {
                                        WebsocketListener.reset = false;
                                        return;
                                    }

                                    OBSWebsocket.stopWebcam("frame");
                                    Websocket.broadcast({
                                        type: "phase",
                                        phase: "ending"
                                    });
                                    until += 65000;
                                    await WebsocketListener.sleep(until - Date.now());
                                    if (WebsocketListener.reset) {
                                        WebsocketListener.reset = false;
                                        return;
                                    }

                                    OBSWebsocket.stopStreaming();
                                    OBSWebsocket.switchScene("Off Air");
                                }

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

WebsocketListener.reset = false;

module.exports = WebsocketListener;
