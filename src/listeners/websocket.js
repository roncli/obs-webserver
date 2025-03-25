const childProcess = require("child_process"),

    ConfigFile = require("../configFile"),
    Lighting = require("../lighting"),
    Log = require("../logging/log"),
    Notifications = require("../notifications"),
    OBSWebsocket = require("../obsWebsocket"),
    pjson = require("../../package.json"),
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
                await OBSWebsocket.start();

                Websocket.broadcast({
                    type: "overlay",
                    data: {
                        type: data.data.overlay,
                        soundPath: data.data.soundPath
                    }
                });

                if (data.data.overlay === "topout") {
                    OBSWebsocket.stopOverlayFilter();
                    setTimeout(OBSWebsocket.startOverlayFilter, 3000);
                }

                break;
            case "lighting":
                Lighting.stopAnimation();

                if (data.data.lighting === "main") {
                    Lighting.initShowcase();
                }

                Lighting.data.currentLights = data.data.lighting;
                Lighting.startAnimation();

                break;
            case "discord":
                if (WebsocketListener.data.phase === "game") {
                    await OBSWebsocket.startDiscord("game");
                } else if (WebsocketListener.data.phase === "analysis") {
                    await OBSWebsocket.startDiscord("analysis");
                } else if (WebsocketListener.data.phase === "headtohead") {
                    await OBSWebsocket.startDiscord("headtohead");
                }
                await WebsocketListener.sleep(1000);
                Websocket.broadcast(data);
                break;
            case "reset":
                Notifications.stop();
                WebsocketListener.reset = true;
                WebsocketListener.data.phase = "";
                Websocket.broadcast(data);
                break;
            case "elapsed":
                Websocket.broadcast({
                    type: "elapsed"
                });
                break;
            case "update-twitch":
                {
                    const roncliGaming = ConfigFile.get("roncliGaming"),
                        title = roncliGaming.title.replace(/\n/g, " - "),
                        game = roncliGaming.game;

                    try {
                        await Twitch.setStreamInfo(title, game);
                    } catch (err) {
                        if (err && err._body) {
                            const body = JSON.parse(err._body);

                            Websocket.broadcast({
                                type: "error",
                                message: `There was an error setting the stream info: Status: ${body.status}, Message: ${body.message}`
                            });
                        }

                        break;
                    }
                }
                break;
            case "load-twitch":
                childProcess.spawn("streamlink", [
                    "--twitch-disable-hosting",
                    "--twitch-disable-ads",
                    "--player", "C:\\Program Files\\VideoLAN\\VLC\\vlc.exe",
                    "--player-args", `--no-one-instance --play-and-exit --input-title-format "Player ${data.player}" --qt-minimal-view --no-audio`,
                    "--hls-live-edge", "3",
                    "--hls-segment-threads", "1",
                    "--retry-open", "1",
                    "--retry-max", "5",
                    "--retry-streams", "1",
                    `twitch.tv/${data.name}`,
                    "best"
                ]);

                if (data.sendSettings) {
                    Websocket.broadcast({
                        type: "settings",
                        data: {
                            type: data.sendSettings,
                            data: ConfigFile.get("roncliGaming")
                        }
                    });
                }

                break;
            case "load-twitch-replay":
                childProcess.spawn("streamlink", [
                    "--twitch-disable-hosting",
                    "--twitch-disable-ads",
                    "--player", "C:\\Program Files\\VideoLAN\\VLC\\vlc.exe",
                    "--player-args", `--no-one-instance --play-and-exit --input-title-format "Player ${data.player} Replay" --qt-minimal-view --no-audio`,
                    "--hls-live-edge", "3",
                    "--hls-segment-threads", "1",
                    "--hls-start-offset", "00:00:20",
                    "--retry-open", "1",
                    "--retry-max", "5",
                    "--retry-streams", "1",
                    `twitch.tv/${data.name}`,
                    "best"
                ]);

                if (data.sendSettings) {
                    Websocket.broadcast({
                        type: "settings",
                        data: {
                            type: data.sendSettings,
                            data: ConfigFile.get("roncliGaming")
                        }
                    });
                }

                break;
            case "toggle-replay": {
                const visible = await OBSWebsocket.isVisible("Restreams", `Player ${data.player} - Replay`);

                if (visible) {
                    OBSWebsocket.stopReplay(`Player ${data.player}`);
                } else {
                    OBSWebsocket.startReplay(`Player ${data.player}`);
                }

                break;
            }
            case "banner":
                Websocket.broadcast({
                    type: "banner",
                    url: data.url
                });

                await ConfigFile.set({banner: data.url});

                break;
            case "timer":
                Websocket.broadcast({
                    type: "timer",
                    command: data.command
                });

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
                                } else if (err.body && err.body.error && err.body.error.reason === "NO_ACTIVE_DEVICE") {
                                    // Just ignore no active device because you can't pause if there's no active device.
                                    okToSend = true;
                                    return;
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
                    case "Start Analysis":
                    case "Start Head to Head":
                    case "Start CTM":
                        {
                            WebsocketListener.data.phase = "intro";
                            Lighting.stopAnimation();
                            Lighting.data.currentLights = "fire";
                            Lighting.startAnimation();

                            let until = Date.now();

                            Notifications.stop();
                            await OBSWebsocket.switchScene("roncli Gaming");
                            OBSWebsocket.stopMic();
                            OBSWebsocket.stopWebcam("ctm");
                            OBSWebsocket.stopWebcam("frame");
                            OBSWebsocket.stopWebcam("game");
                            OBSWebsocket.stopWebcam("analysis");
                            OBSWebsocket.stopDisplay();
                            OBSWebsocket.stopCTM();
                            OBSWebsocket.stopRestreams();
                            OBSWebsocket.stopReplay("Player 1");
                            OBSWebsocket.stopReplay("Player 2");
                            OBSWebsocket.stopDiscord("game");
                            OBSWebsocket.stopDiscord("analysis");
                            OBSWebsocket.stopDiscord("headtohead");
                            OBSWebsocket.stopTetris();
                            OBSWebsocket.stopRestreams();
                            OBSWebsocket.stopReplay("Player 1");
                            OBSWebsocket.stopReplay("Player 2");
                            until += 5000;
                            await WebsocketListener.sleep(until - Date.now());
                            if (WebsocketListener.reset) {
                                WebsocketListener.reset = false;
                                return;
                            }

                            OBSWebsocket.startStreaming();

                            Websocket.broadcast({
                                type: "scene",
                                scene: "intro"
                            });
                            until += 15000;
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
                            until += 13750;
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
                            until += 625;
                            await WebsocketListener.sleep(until - Date.now());
                            if (WebsocketListener.reset) {
                                WebsocketListener.reset = false;
                                return;
                            }

                            Lighting.stopAnimation();
                            Lighting.initShowcase();
                            Lighting.data.currentLights = "main";
                            Lighting.startAnimation();

                            Websocket.broadcast({
                                type: "scene",
                                scene: {"Start Stream": "game", "Start Analysis": "analysis", "Start Head to Head": "headtohead", "Start CTM": "ctm"}[data.scene]
                            });
                            OBSWebsocket.startMic();
                            OBSWebsocket.stopWebcam("frame");
                            switch (data.scene) {
                                case "Start Stream":
                                    OBSWebsocket.startWebcam("game");
                                    OBSWebsocket.stopWebcam("ctm");
                                    OBSWebsocket.stopWebcam("analysis");
                                    OBSWebsocket.startDisplay();
                                    OBSWebsocket.stopCTM();
                                    OBSWebsocket.stopRestreams();
                                    OBSWebsocket.stopReplay("Player 1");
                                    OBSWebsocket.stopReplay("Player 2");
                                    break;
                                case "Start Analysis":
                                    OBSWebsocket.stopWebcam("game");
                                    OBSWebsocket.stopWebcam("ctm");
                                    OBSWebsocket.startWebcam("analysis");
                                    OBSWebsocket.stopDisplay();
                                    OBSWebsocket.stopCTM();
                                    OBSWebsocket.stopRestreams();
                                    OBSWebsocket.stopReplay("Player 1");
                                    OBSWebsocket.stopReplay("Player 2");
                                    break;
                                case "Start Head to Head":
                                    OBSWebsocket.stopWebcam("game");
                                    OBSWebsocket.stopWebcam("ctm");
                                    OBSWebsocket.stopWebcam("analysis");
                                    OBSWebsocket.stopDisplay();
                                    OBSWebsocket.stopCTM();
                                    OBSWebsocket.startRestreams();
                                    OBSWebsocket.stopReplay("Player 1");
                                    OBSWebsocket.stopReplay("Player 2");
                                    break;
                                case "Start CTM":
                                    OBSWebsocket.stopWebcam("game");
                                    OBSWebsocket.startWebcam("ctm");
                                    OBSWebsocket.stopWebcam("analysis");
                                    OBSWebsocket.stopDisplay();
                                    OBSWebsocket.startCTM();
                                    OBSWebsocket.stopRestreams();
                                    OBSWebsocket.stopReplay("Player 1");
                                    OBSWebsocket.stopReplay("Player 2");
                                    break;
                            }
                            OBSWebsocket.stopDiscord("game");
                            OBSWebsocket.stopDiscord("analysis");
                            OBSWebsocket.stopDiscord("headtohead");
                            until += 2000;
                            await WebsocketListener.sleep(until - Date.now());

                            Notifications.start();
                        }

                        WebsocketListener.data.phase = {"Start Stream": "game", "Start Analysis": "analysis", "Start Head to Head": "headtohead", "Start CTM": "ctm"}[data.scene];
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

                                    Lighting.stopAnimation();
                                    Lighting.data.currentLights = "fire";
                                    Lighting.startAnimation();
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
                                    OBSWebsocket.stopWebcam("ctm");
                                    OBSWebsocket.startWebcam("frame");
                                    OBSWebsocket.stopWebcam("game");
                                    OBSWebsocket.stopWebcam("analysis");
                                    OBSWebsocket.stopDisplay();
                                    OBSWebsocket.stopCTM();
                                    OBSWebsocket.stopRestreams();
                                    OBSWebsocket.stopReplay("Player 1");
                                    OBSWebsocket.stopReplay("Player 2");
                                    OBSWebsocket.stopDiscord("game");
                                    OBSWebsocket.stopDiscord("analysis");
                                    OBSWebsocket.stopDiscord("headtohead");
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

                                    Lighting.stopAnimation();
                                    Lighting.data.currentLights = "main";
                                    Lighting.startAnimation();
                                    Websocket.broadcast({
                                        type: "scene",
                                        scene: "game"
                                    });
                                    OBSWebsocket.startMic();
                                    OBSWebsocket.stopWebcam("ctm");
                                    OBSWebsocket.stopWebcam("frame");
                                    OBSWebsocket.startWebcam("game");
                                    OBSWebsocket.stopWebcam("analysis");
                                    OBSWebsocket.startDisplay();
                                    OBSWebsocket.stopCTM();
                                    OBSWebsocket.stopRestreams();
                                    OBSWebsocket.stopReplay("Player 1");
                                    OBSWebsocket.stopReplay("Player 2");
                                    OBSWebsocket.stopDiscord("game");
                                    OBSWebsocket.stopDiscord("analysis");
                                    OBSWebsocket.stopDiscord("headtohead");
                                    until += 2000;
                                    await WebsocketListener.sleep(until - Date.now());

                                    Notifications.start();
                                }
                                break;
                        }
                        WebsocketListener.data.phase = "game";
                        break;
                    case "Analysis":
                        switch (WebsocketListener.data.phase) {
                            case "intro":
                            case "ending":
                            case "analysis":
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

                                    Lighting.stopAnimation();
                                    Lighting.data.currentLights = "main";
                                    Lighting.startAnimation();
                                    Websocket.broadcast({
                                        type: "scene",
                                        scene: "analysis"
                                    });
                                    OBSWebsocket.startMic();
                                    OBSWebsocket.stopWebcam("ctm");
                                    OBSWebsocket.stopWebcam("frame");
                                    OBSWebsocket.stopWebcam("game");
                                    OBSWebsocket.startWebcam("analysis");
                                    OBSWebsocket.stopDisplay();
                                    OBSWebsocket.stopCTM();
                                    OBSWebsocket.stopRestreams();
                                    OBSWebsocket.stopReplay("Player 1");
                                    OBSWebsocket.stopReplay("Player 2");
                                    OBSWebsocket.stopDiscord("game");
                                    OBSWebsocket.stopDiscord("analysis");
                                    OBSWebsocket.stopDiscord("headtohead");
                                    until += 2000;
                                    await WebsocketListener.sleep(until - Date.now());

                                    Notifications.start();
                                }
                                break;
                        }
                        WebsocketListener.data.phase = "analysis";
                        break;
                    case "Head to Head":
                        switch (WebsocketListener.data.phase) {
                            case "intro":
                            case "ending":
                            case "headtohead":
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
                                        scene: "headtohead",
                                        banner: ConfigFile.get("banner")
                                    });
                                    OBSWebsocket.startMic();
                                    OBSWebsocket.stopWebcam("ctm");
                                    OBSWebsocket.stopWebcam("frame");
                                    OBSWebsocket.stopWebcam("game");
                                    OBSWebsocket.stopWebcam("analysis");
                                    OBSWebsocket.stopDisplay();
                                    OBSWebsocket.stopCTM();
                                    OBSWebsocket.startRestreams();
                                    OBSWebsocket.stopReplay("Player 1");
                                    OBSWebsocket.stopReplay("Player 2");
                                    OBSWebsocket.stopDiscord("game");
                                    OBSWebsocket.stopDiscord("analysis");
                                    OBSWebsocket.stopDiscord("headtohead");
                                    until += 2000;
                                    await WebsocketListener.sleep(until - Date.now());

                                    Notifications.start();
                                }
                                break;
                        }
                        WebsocketListener.data.phase = "headtohead";
                        break;
                    case "CTM":
                        switch (WebsocketListener.data.phase) {
                            case "intro":
                            case "ending":
                            case "ctm":
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

                                    Lighting.stopAnimation();
                                    Lighting.data.currentLights = "main";
                                    Lighting.startAnimation();
                                    Websocket.broadcast({
                                        type: "scene",
                                        scene: "ctm"
                                    });
                                    OBSWebsocket.startMic();
                                    OBSWebsocket.startWebcam("ctm");
                                    OBSWebsocket.stopWebcam("frame");
                                    OBSWebsocket.stopWebcam("game");
                                    OBSWebsocket.stopWebcam("analysis");
                                    OBSWebsocket.stopDisplay();
                                    OBSWebsocket.startCTM();
                                    OBSWebsocket.stopRestreams();
                                    OBSWebsocket.stopReplay("Player 1");
                                    OBSWebsocket.stopReplay("Player 2");
                                    OBSWebsocket.stopDiscord("game");
                                    OBSWebsocket.stopDiscord("analysis");
                                    OBSWebsocket.stopDiscord("headtohead");
                                    until += 2000;
                                    await WebsocketListener.sleep(until - Date.now());

                                    Notifications.start();
                                }
                                break;
                        }
                        WebsocketListener.data.phase = "ctm";
                        break;
                    case "BRB":
                        switch (WebsocketListener.data.phase) {
                            case "intro":
                            case "ending":
                            case "brb":
                                return;
                            case "webcam":
                                {
                                    let until = Date.now();

                                    Notifications.stop();
                                    OBSWebsocket.stopMic();
                                    OBSWebsocket.stopWebcam("frame");
                                    Websocket.broadcast({
                                        type: "phase",
                                        phase: "brb"
                                    });
                                    until += 500;
                                    await WebsocketListener.sleep(until - Date.now());
                                    if (WebsocketListener.reset) {
                                        WebsocketListener.reset = false;
                                        return;
                                    }

                                    Twitch.runAd();
                                }
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
                                    OBSWebsocket.stopWebcam("ctm");
                                    OBSWebsocket.stopWebcam("frame");
                                    OBSWebsocket.stopWebcam("game");
                                    OBSWebsocket.stopWebcam("analysis");
                                    OBSWebsocket.stopDisplay();
                                    OBSWebsocket.stopCTM();
                                    OBSWebsocket.stopRestreams();
                                    OBSWebsocket.stopReplay("Player 1");
                                    OBSWebsocket.stopReplay("Player 2");
                                    OBSWebsocket.stopDiscord("game");
                                    OBSWebsocket.stopDiscord("analysis");
                                    OBSWebsocket.stopDiscord("headtohead");
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
                                    if (WebsocketListener.isEnding) {
                                        return;
                                    }
                                    WebsocketListener.isEnding = true;

                                    let until = Date.now();

                                    Notifications.stop();

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
                                            WebsocketListener.isEnding = false;
                                            return;
                                        }

                                        Lighting.stopAnimation();
                                        Lighting.data.currentLights = "fire";
                                        Lighting.startAnimation();
                                        OBSWebsocket.stopDisplay();
                                        OBSWebsocket.stopCTM();
                                        OBSWebsocket.stopRestreams();
                                        OBSWebsocket.stopReplay("Player 1");
                                        OBSWebsocket.stopReplay("Player 2");
                                        OBSWebsocket.stopDiscord("game");
                                        OBSWebsocket.stopDiscord("analysis");
                                        OBSWebsocket.stopDiscord("headtohead");
                                        OBSWebsocket.stopWebcam("ctm");
                                        OBSWebsocket.startWebcam("frame");
                                        OBSWebsocket.stopWebcam("game");
                                        OBSWebsocket.stopWebcam("analysis");
                                        Websocket.broadcast({
                                            type: "scene",
                                            scene: "frame"
                                        });
                                        until += 200;
                                        await WebsocketListener.sleep(until - Date.now());
                                        if (WebsocketListener.reset) {
                                            WebsocketListener.reset = false;
                                            WebsocketListener.isEnding = false;
                                            return;
                                        }
                                    } else {
                                        OBSWebsocket.startWebcam("frame");
                                    }

                                    WebsocketListener.data.phase = "ending";
                                    OBSWebsocket.startMic();
                                    Websocket.broadcast({
                                        type: "phase",
                                        phase: "webcam"
                                    });
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
                                        WebsocketListener.isEnding = false;
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
                                        WebsocketListener.isEnding = false;
                                        return;
                                    }

                                    Lighting.stopAnimation();
                                    Lighting.data.currentLights = "main";
                                    Lighting.startAnimation();

                                    OBSWebsocket.stopWebcam("frame");
                                    Websocket.broadcast({
                                        type: "phase",
                                        phase: "ending",
                                        version: pjson.version
                                    });
                                    until += 65000;
                                    await WebsocketListener.sleep(until - Date.now());
                                    if (WebsocketListener.reset) {
                                        WebsocketListener.reset = false;
                                        WebsocketListener.isEnding = false;
                                        return;
                                    }

                                    OBSWebsocket.stopStreaming();
                                    OBSWebsocket.switchScene("Off Air");
                                    Notifications.reset();

                                    WebsocketListener.isEnding = false;
                                }

                                break;
                        }
                        WebsocketListener.data.phase = "";
                        break;
                    case "Start Tetris":
                        {
                            WebsocketListener.data.phase = "tetris";

                            let until = Date.now();

                            Notifications.stop();
                            await OBSWebsocket.switchScene("roncli Gaming");
                            OBSWebsocket.stopWebcam("ctm");
                            OBSWebsocket.stopWebcam("frame");
                            OBSWebsocket.stopWebcam("game");
                            OBSWebsocket.stopWebcam("analysis");
                            OBSWebsocket.stopDisplay();
                            OBSWebsocket.stopCTM();
                            OBSWebsocket.stopRestreams();
                            OBSWebsocket.stopReplay("Player 1");
                            OBSWebsocket.stopReplay("Player 2");
                            OBSWebsocket.stopDiscord("game");
                            OBSWebsocket.stopDiscord("analysis");
                            OBSWebsocket.stopDiscord("headtohead");
                            OBSWebsocket.stopTetris();

                            until += 5000;
                            await WebsocketListener.sleep(until - Date.now());
                            if (WebsocketListener.reset) {
                                WebsocketListener.reset = false;
                                return;
                            }

                            OBSWebsocket.startStreaming();
                            Websocket.broadcast({
                                type: "scene",
                                scene: "tetris",
                                data: {
                                    organization: data.organization,
                                    title: data.title,
                                    color: data.color
                                }
                            });

                            WebsocketListener.data.phase = "Tetris BRB";
                        }

                        break;
                    case "Tetris BRB":
                        switch (WebsocketListener.data.phase) {
                            case "2P12":
                            case "2P34":
                            case "4P":
                                {
                                    let until = Date.now();

                                    Websocket.broadcast({
                                        type: "overlay",
                                        data: {
                                            type: "topout"
                                        }
                                    });
                                    OBSWebsocket.stopOverlayFilter();
                                    setTimeout(OBSWebsocket.startOverlayFilter, 3000);

                                    until += 1000;
                                    await WebsocketListener.sleep(until - Date.now());
                                    if (WebsocketListener.reset) {
                                        WebsocketListener.reset = false;
                                        return;
                                    }
                                }
                                break;
                        }

                        Websocket.broadcast({
                            type: "scene",
                            scene: "tetris",
                            data: {
                                organization: data.organization,
                                title: data.title,
                                color: data.color
                            }
                        });
                        OBSWebsocket.stopTetris();

                        WebsocketListener.data.phase = "Tetris BRB";
                        break;
                    case "2P12":
                        switch (WebsocketListener.data.phase) {
                            case "Tetris BRB":
                            case "2P34":
                            case "4P":
                                {
                                    let until = Date.now();

                                    Websocket.broadcast({
                                        type: "overlay",
                                        data: {
                                            type: "topout"
                                        }
                                    });
                                    OBSWebsocket.stopOverlayFilter();
                                    setTimeout(OBSWebsocket.startOverlayFilter, 3000);

                                    until += 1000;
                                    await WebsocketListener.sleep(until - Date.now());
                                    if (WebsocketListener.reset) {
                                        WebsocketListener.reset = false;
                                        return;
                                    }
                                }
                                break;
                        }

                        Websocket.broadcast({
                            type: "scene",
                            scene: "tetris2p",
                            data: {
                                event: data.event,
                                player1: data.player1,
                                player2: data.player2
                            }
                        });
                        OBSWebsocket.startTetris2P12();
                        Websocket.broadcast({
                            type: "players",
                            data: {oneTwo: true}
                        });
                        WebsocketListener.data.phase = "2P12";
                        break;
                    case "2P34":
                        switch (WebsocketListener.data.phase) {
                            case "Tetris BRB":
                            case "2P12":
                            case "4P":
                                {
                                    let until = Date.now();

                                    Websocket.broadcast({
                                        type: "overlay",
                                        data: {
                                            type: "topout"
                                        }
                                    });
                                    OBSWebsocket.stopOverlayFilter();
                                    setTimeout(OBSWebsocket.startOverlayFilter, 3000);

                                    until += 1000;
                                    await WebsocketListener.sleep(until - Date.now());
                                    if (WebsocketListener.reset) {
                                        WebsocketListener.reset = false;
                                        return;
                                    }
                                }
                                break;
                        }

                        Websocket.broadcast({
                            type: "scene",
                            scene: "tetris2p",
                            data: {
                                event: data.event,
                                player1: data.player1,
                                player2: data.player2
                            }
                        });
                        OBSWebsocket.startTetris2P34();
                        Websocket.broadcast({
                            type: "players",
                            data: {oneTwo: false}
                        });
                        WebsocketListener.data.phase = "2P34";
                        break;
                    case "4P":
                        switch (WebsocketListener.data.phase) {
                            case "Tetris BRB":
                            case "2P12":
                            case "2P23":
                                {
                                    let until = Date.now();

                                    Websocket.broadcast({
                                        type: "overlay",
                                        data: {
                                            type: "topout"
                                        }
                                    });
                                    OBSWebsocket.stopOverlayFilter();
                                    setTimeout(OBSWebsocket.startOverlayFilter, 3000);

                                    until += 1000;
                                    await WebsocketListener.sleep(until - Date.now());
                                    if (WebsocketListener.reset) {
                                        WebsocketListener.reset = false;
                                        return;
                                    }
                                }
                                break;
                        }

                        Websocket.broadcast({
                            type: "scene",
                            scene: "tetris4p",
                            data: {
                                event: data.event,
                                player1: data.player1,
                                player2: data.player2,
                                player3: data.player3,
                                player4: data.player4
                            }
                        });
                        OBSWebsocket.startTetris4P();
                        WebsocketListener.data.phase = "4P";
                        break;
                    case "End Tetris":
                        OBSWebsocket.stopStreaming();
                        OBSWebsocket.switchScene("Off Air");
                        Notifications.reset();
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
}

WebsocketListener.data = {
    phase: ""
};

WebsocketListener.isEnding = false;

WebsocketListener.reset = false;

module.exports = WebsocketListener;
