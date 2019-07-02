/* global config, OBSWebSocket, Spotify */

//   ###   #####  #   #
//  #   #    #    #   #
//  #        #    ## ##
//  #        #    # # #
//  #        #    #   #
//  #   #    #    #   #
//   ###     #    #   #
/**
 * A class of static functions for the CTM page.
 */
class CTM {
    //                      #  #                       ##
    //                      #  #                        #
    // ###    ##    ###   ###  #      ##    ##    ###   #
    // #  #  # ##  #  #  #  #  #     #  #  #     #  #   #
    // #     ##    # ##  #  #  #     #  #  #     # ##   #
    // #      ##    # #   ###  ####   ##    ##    # #  ###
    /**
     * Reads a local file.
     * @param {string} path The path of the file.
     * @param {boolean} base64 Whether to retrieve its Base64 representation.
     * @returns {Promise<string>} A promise that resolves with the contents of the file.
     */
    static readLocal(path, base64) {
        return new Promise((resolve, reject) => {
            const x = new XMLHttpRequest();

            x.onreadystatechange = () => {
                if (x.readyState !== 4) {
                    return;
                }

                if (x.readyState === 4 && x.status === 200) {
                    resolve(x.responseText);
                } else {
                    reject(new Error());
                }
            };
            x.open("GET", `api/local?${base64 ? "base64=true&" : ""}file=${encodeURIComponent(path)}`, true);
            x.send();
        });
    }

    //       #                 #     #                   #    #  #           #         #
    //       #                 #     #                   #    #  #           #         #
    //  ##   ###    ##    ##   # #   #      ###   ###   ###   #  #  ###    ###   ###  ###    ##
    // #     #  #  # ##  #     ##    #     #  #  ##      #    #  #  #  #  #  #  #  #   #    # ##
    // #     #  #  ##    #     # #   #     # ##    ##    #    #  #  #  #  #  #  # ##   #    ##
    //  ##   #  #   ##    ##   #  #  ####   # #  ###      ##   ##   ###    ###   # #    ##   ##
    //                                                              #
    /**
     * Checks the last update date of a local file.
     * @param {string} path The path of the file.
     * @returns {Promise<string>} A promise that resolves with the last update date of the file.
     */
    static checkLastUpdate(path) {
        return new Promise((resolve, reject) => {
            const x = new XMLHttpRequest();

            x.timeout = 5000;
            x.onreadystatechange = () => {
                if (x.readyState !== 4) {
                    return;
                }

                if (x.readyState === 4 && x.status === 200) {
                    resolve(x.responseText);
                } else {
                    reject(new Error());
                }
            };

            x.ontimeout = () => {
                reject(new Error());
            };

            x.onerror = () => {
                reject(new Error());
            };

            x.open(`GET", "api/lastModified?file=${encodeURIComponent(path)}`, true);
            x.send();
        });
    }

    //                #         #          #  #   #       #
    //                #         #          #  #           #
    // #  #  ###    ###   ###  ###    ##   #  #  ##     ###   ##    ##
    // #  #  #  #  #  #  #  #   #    # ##  #  #   #    #  #  # ##  #  #
    // #  #  #  #  #  #  # ##   #    ##     ##    #    #  #  ##    #  #
    //  ###  ###    ###   # #    ##   ##    ##   ###    ###   ##    ##
    //       #
    /**
     * Updates the specified video element with the web cam feed.
     * @param {string} element The element to update.
     * @returns {Promise} A promise that returns when the video element is updated.
     */
    static async updateVideo(element) {
        const video = document.querySelector(element),
            devices = await navigator.mediaDevices.enumerateDevices(),
            {deviceId} = devices.filter((d) => d.kind === "videoinput" && d.label.startsWith("Logitech HD Pro Webcam C920"))[0];

        navigator.webkitGetUserMedia({
            video: {
                mandatory: {
                    minWidth: 1920,
                    minHeight: 1080
                },
                optional: [{sourceId: deviceId}]
            }
        }, (stream) => {
            video.srcObject = stream;
        }, (err) => {
            console.log(err);
        });
    }

    //                #         #          ###    #
    //                #         #          #  #
    // #  #  ###    ###   ###  ###    ##   #  #  ##    # #
    // #  #  #  #  #  #  #  #   #    # ##  #  #   #    # #
    // #  #  #  #  #  #  # ##   #    ##    #  #   #    # #
    //  ###  ###    ###   # #    ##   ##   ###   ###    #
    //       #
    /**
     * Updates the specified div element with the text from a local path at a specified interval.
     * @param {string} element The element to update.
     * @param {string} path The local path to get the text.
     * @param {number} interval The interval in milliseconds to update the text.
     * @returns {Promise} A promise that resolves when the div element is updated.
     */
    static async updateDiv(element, path, interval) {
        try {
            const responseText = await CTM.readLocal(path, false);

            document.querySelector(element).innerText = responseText;
        } finally {
            setTimeout(() => {
                CTM.updateDiv(element, path, interval);
            }, interval);
        }
    }

    //                #         #          ###    #     #    ##
    //                #         #           #           #     #
    // #  #  ###    ###   ###  ###    ##    #    ##    ###    #     ##
    // #  #  #  #  #  #  #  #   #    # ##   #     #     #     #    # ##
    // #  #  #  #  #  #  # ##   #    ##     #     #     #     #    ##
    //  ###  ###    ###   # #    ##   ##    #    ###     ##  ###    ##
    //       #
    /**
     * Updates the title with the text from a local path at a specified interval.
     * @param {string} path The local path to get the text.
     * @param {number} interval The interval in milliseconds to update the text.
     * @returns {Promise} A promise that resolves when the title is updated.
     */
    static async updateTitle(path, interval) {
        try {
            const responseText = await CTM.readLocal(path, false),
                lines = responseText.split("\n");

            document.querySelector("#title-1").innerText = lines[0];
            document.querySelector("#title-2").innerText = lines[1];
        } finally {
            setTimeout(() => {
                CTM.updateTitle(path, interval);
            }, interval);
        }
    }

    //                #         #          ###                #
    //                #         #           #                 #
    // #  #  ###    ###   ###  ###    ##    #     ##   #  #  ###
    // #  #  #  #  #  #  #  #   #    # ##   #    # ##   ##    #
    // #  #  #  #  #  #  # ##   #    ##     #    ##     ##    #
    //  ###  ###    ###   # #    ##   ##    #     ##   #  #    ##
    //       #
    /**
     * Updates the stream text with the text from a local path at a specified interval.
     * @param {string} path The local path to get the text.
     * @param {number} interval The interval in milliseconds to update the text.
     * @returns {Promise} A promise that resolves when the text is updated.
     */
    static async updateText(path, interval) {
        try {
            const responseText = await CTM.readLocal(path, false);

            const lines = responseText.trim().split("\n"),
                outerEl = document.createElement("div");

            let open = false,
                innerEl;

            lines.forEach((line) => {
                line = line.trim();

                if (line.length > 0 && !open) {
                    innerEl = document.createElement("div");
                    innerEl.classList.add("panel");
                    innerEl.classList.add("panel-primary");

                    const el = document.createElement("div");
                    el.classList.add("panel-heading");
                    el.classList.add("text-center");
                    el.innerText = line;
                    innerEl.appendChild(el);

                    open = true;
                } else if (line.length === 0 && open) {
                    outerEl.appendChild(innerEl);
                    open = false;
                } else if (line.length > 0) {
                    const el = document.createElement("div");
                    el.classList.add("panel-body");
                    el.innerText = line;
                    innerEl.appendChild(el);
                }
            });

            outerEl.appendChild(innerEl);

            document.querySelector("#stream-text").innerHTML = outerEl.innerHTML;
        } finally {
            setTimeout(() => {
                CTM.updateText(path, interval);
            }, interval);
        }
    }

    //                #         #          ###
    //                #         #           #
    // #  #  ###    ###   ###  ###    ##    #    # #    ###   ###   ##
    // #  #  #  #  #  #  #  #   #    # ##   #    ####  #  #  #  #  # ##
    // #  #  #  #  #  #  # ##   #    ##     #    #  #  # ##   ##   ##
    //  ###  ###    ###   # #    ##   ##   ###   #  #   # #  #      ##
    //       #                                                ###
    /**
     * Updates the specified image element with the image from a local path at a specified interval.
     * @param {string} element The element to update.
     * @param {string} path The local path to get the image.
     * @param {number} interval The interval in milliseconds to update the image.
     * @param {string} [lastUpdated] The last updated date of the image.  Leave undefined to force an update.
     * @returns {Promise} A promise that resolves when the image element is updated.
     */
    static async updateImage(element, path, interval, lastUpdated) {
        let responseText;

        try {
            responseText = await CTM.checkLastUpdate(path);

            if (responseText !== lastUpdated) {
                const imageData = await CTM.readLocal(path, true);

                document.querySelector(element).src = `data:image/png;base64,${imageData}`;
            }
            return responseText;
        } finally {
            setTimeout(() => {
                CTM.updateImage(element, path, interval, responseText || lastUpdated);
            }, interval);
        }
    }

    //                #         #           ##                #     #      #
    //                #         #          #  #               #           # #
    // #  #  ###    ###   ###  ###    ##    #    ###    ##   ###   ##     #    #  #
    // #  #  #  #  #  #  #  #   #    # ##    #   #  #  #  #   #     #    ###   #  #
    // #  #  #  #  #  #  # ##   #    ##    #  #  #  #  #  #   #     #     #     # #
    //  ###  ###    ###   # #    ##   ##    ##   ###    ##     ##  ###    #      #
    //       #                                   #                              #
    /**
     * Updates the specified div and image elements with information from Spotify at the specified interval.
     * @param {string} textElement The text element to update with the song title.
     * @param {string} imageElement The image element to update with the album art.
     * @param {number} interval The interval in milliseconds to update the information.
     * @returns {Promise} A promise that resolves when Spotify is updated.
     */
    static async updateSpotify(textElement, imageElement, interval) {
        let thisInterval;

        try {
            const response = await Spotify.readSpotify(),
                image = document.querySelector(imageElement);

            if (response.playing) {
                document.querySelector(textElement).innerText = `Now Playing:\n${response.artist}\n${response.title}`;
                if (response.imageUrl) {
                    if (response.imageUrl !== document.querySelector(imageElement).src) {
                        ({imageUrl: image.src} = response);
                        image.classList.remove("hidden");
                    }
                } else {
                    image.src = "";
                    image.classList.add("hidden");
                }

                thisInterval = Math.min(1000 + response.duration - response.progress || interval, interval);
            } else {
                document.querySelector(textElement).innerText = "";
                image.src = "";
                image.classList.add("hidden");

                thisInterval = void 0;
            }
        } finally {
            setTimeout(() => {
                CTM.updateSpotify(textElement, imageElement, interval);
            }, thisInterval || interval);
        }
    }

    //                #
    //                #
    // ###    ##    ###
    // #  #  # ##  #  #
    // #     ##    #  #
    // #      ##    ###
    /**
     * Gets the amount of red on a spectrum at a given percentage.
     * @param {number} x The percentange at which to find the red value.
     * @returns {number} The amount of red to use.
     */
    static red(x) {
        if (x <= 1 / 6 || x >= 5 / 6) {
            return 255;
        }

        if (x >= 2 / 6 && x <= 4 / 6) {
            return 0;
        }

        if (x > 1 / 6 && x < 2 / 6) {
            return Math.floor((2 / 6 - x) * 6 * 255);
        }

        if (x > 4 / 6 && x < 5 / 6) {
            return Math.floor((x - 4 / 6) * 6 * 255);
        }

        return 0;
    }

    //  ###  ###    ##    ##   ###
    // #  #  #  #  # ##  # ##  #  #
    //  ##   #     ##    ##    #  #
    // #     #      ##    ##   #  #
    //  ###
    /**
     * Gets the amount of green on a spectrum at a given percentage.
     * @param {number} x The percentange at which to find the green value.
     * @returns {number} The amount of green to use.
     */
    static green(x) {
        if (x >= 1 / 6 && x <= 3 / 6) {
            return 255;
        }

        if (x >= 4 / 6) {
            return 0;
        }

        if (x > 3 / 6 && x < 4 / 6) {
            return Math.floor((4 / 6 - x) * 6 * 255);
        }

        if (x < 1 / 6) {
            return Math.floor(x * 6 * 255);
        }

        return 0;
    }

    // #     ##
    // #      #
    // ###    #    #  #   ##
    // #  #   #    #  #  # ##
    // #  #   #    #  #  ##
    // ###   ###    ###   ##
    /**
     * Gets the amount of blue on a spectrum at a given percentage.
     * @param {number} x The percentange at which to find the blue value.
     * @returns {number} The amount of blue to use.
     */
    static blue(x) {
        if (x >= 3 / 6 && x <= 5 / 6) {
            return 255;
        }

        if (x <= 2 / 6) {
            return 0;
        }

        if (x > 5 / 6) {
            return Math.floor((1 - x) * 6 * 255);
        }

        if (x > 2 / 6 && x < 3 / 6) {
            return Math.floor((x - 2 / 6) * 6 * 255);
        }

        return 0;
    }

    //    #
    //    #
    //  ###  ###    ###  #  #
    // #  #  #  #  #  #  #  #
    // #  #  #     # ##  ####
    //  ###  #      # #  ####
    /**
     * Draws a frame of the analyzer.
     * @returns {void}
     */
    static draw() {
        requestAnimationFrame(CTM.draw);

        if (document.getElementById("intro").classList.contains("hidden")) {
            return;
        }

        const buffer = new Uint8Array(CTM.analyser.frequencyBinCount);

        CTM.analyser.getByteFrequencyData(buffer);

        CTM.canvasContext.clearRect(0, 0, 1920, 400);

        let x = 0;

        for (let i = 0; i < CTM.analyser.frequencyBinCount; i++) {
            if (x >= 1920) {
                break;
            }

            const {[i]: barHeight} = buffer;

            CTM.canvasContext.fillStyle = `rgb(${CTM.red(x / 1920)}, ${CTM.green(x / 1920)}, ${CTM.blue(x / 1920)})`;
            CTM.canvasContext.fillRect(x, 400 - 400 * barHeight / 255, 2500 / CTM.analyser.frequencyBinCount - 1, 400 * barHeight / 255);
            x += 2500 / CTM.analyser.frequencyBinCount;
        }
    }

    //                   ##
    //                    #
    //  ###  ###    ###   #    #  #  ####   ##   ###
    // #  #  #  #  #  #   #    #  #    #   # ##  #  #
    // # ##  #  #  # ##   #     # #   #    ##    #
    //  # #  #  #   # #  ###     #   ####   ##   #
    //                          #
    /**
     * Draws the analyzer.
     * @returns {Promise} A promise that resolves when the analyzer is drawn.
     */
    static async analyzer() {
        const audioContext = new window.AudioContext(),
            canvas = document.getElementById("analyzer");

        CTM.analyser = audioContext.createAnalyser();
        CTM.canvasContext = canvas.getContext("2d");

        CTM.analyser.minDecibels = -105;
        CTM.analyser.maxDecibels = -15;
        CTM.analyser.smoothingTimeConstant = 0.5;
        CTM.analyser.fftSize = 512;

        try {
            const devices = await navigator.mediaDevices.enumerateDevices(),
                device = devices.find((d) => d.kind === "audioinput" && d.label === "Stereo Mix (Realtek High Definition Audio)");

            if (device) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({audio: {deviceId: {exact: device.deviceId}}, video: false}),
                        source = audioContext.createMediaStreamSource(stream);

                    source.connect(CTM.analyser);

                    CTM.canvasContext.clearRect(0, 0, 1920, 400);

                    CTM.draw();
                } catch (err) {
                    console.log(err);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    //         #                 #    #  #        #                        #            #
    //         #                 #    #  #        #                        #            #
    //  ###   ###    ###  ###   ###   #  #   ##   ###    ###    ##    ##   # #    ##   ###    ###
    // ##      #    #  #  #  #   #    ####  # ##  #  #  ##     #  #  #     ##    # ##   #    ##
    //   ##    #    # ##  #      #    ####  ##    #  #    ##   #  #  #     # #   ##     #      ##
    // ###      ##   # #  #       ##  #  #   ##   ###   ###     ##    ##   #  #   ##     ##  ###
    /**
     * Starts the WebSocket connections and performs updates based on the messages received.
     * @returns {void}
     */
    static startWebsockets() {
        CTM.ws = new WebSocket(`ws://${document.location.hostname}:${document.location.port || "80"}/ws/listen`);
        CTM.obs = new OBSWebSocket();

        CTM.ws.onmessage = (ev) => {
            const data = JSON.parse(ev.data);

            switch (data.type) {
                case "obs-scene":
                    CTM.obs.send("SetCurrentScene", {"scene-name": data.scene});
                    break;
                case "scene":
                    [].forEach.call(document.getElementsByClassName("scene"), (el) => {
                        el.classList.add("hidden");
                    });

                    document.getElementById("screen").classList.remove("green-screen");

                    break;
                case "action":
                    switch (data.action) {
                        case "fire":
                            {
                                const sound = document.getElementById("sound-fire");

                                sound.volume = 1;
                                sound.play();
                            }

                            document.getElementById("fire").classList.add("fade-animation");

                            setTimeout(() => {
                                document.getElementById("fire").classList.remove("fade-animation");
                            }, 12000);
                            break;
                        case "time":
                            document.getElementById("time").classList.add("blink-animation");

                            setTimeout(() => {
                                document.getElementById("time").classList.remove("blink-animation");
                            }, 12000);
                            break;
                    }
                    break;
            }
        };

        CTM.obs.connect(config.websocket);
    }

    // ###    ##   #  #   ##                #                 #    #                    #           #
    // #  #  #  #  ####  #  #               #                 #    #                    #           #
    // #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
    // #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
    // #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
    // ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
    /**
     * Starts up the index page.
     * @returns {void}
     */
    static DOMContentLoaded() {
        CTM.analyzer();
        CTM.updateText("C:\\Users\\roncli\\Desktop\\roncliGaming\\roncliGamingStreamText.txt", 5000);
        CTM.updateTitle("C:\\Users\\roncli\\Desktop\\roncliGaming\\roncliGamingUpNext.txt", 5000);
        CTM.updateSpotify(".track-text", ".album-art", 5000);
        CTM.startWebsockets();
        CTM.updateVideo("#webcam");
    }
}

document.addEventListener("DOMContentLoaded", CTM.DOMContentLoaded);
