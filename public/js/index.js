/* global config, OBSWebSocket, Spotify */

const slideshowImages = [
    "images/crypt.png",
    "images/deathstate.png",
    "images/descent.png",
    "images/diablo3.png",
    "images/overwatch.png",
    "images/sl0.png",
    "images/wow.png"
];

//   ###              #
//    #               #
//    #    # ##    ## #   ###   #   #
//    #    ##  #  #  ##  #   #   # #
//    #    #   #  #   #  #####    #
//    #    #   #  #  ##  #       # #
//   ###   #   #   ## #   ###   #   #
/**
 * A class of static functions for the index page.
 */
class Index {
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

    //              #    ###         ##
    //              #    #  #         #
    //  ###   ##   ###   #  #   ##    #
    // #  #  # ##   #    #  #  #      #
    //  ##   ##     #    #  #  #      #
    // #      ##     ##  ###    ##   ###
    //  ###
    /**
     * Gets DCL stats.
     * @returns {Promise<object>} A promise that resolves with the DCL data.
     */
    static getDcl() {
        return new Promise((resolve, reject) => {
            if (Index.dclStats) {
                resolve(Index.dclStats);
                return;
            }

            const x = new XMLHttpRequest();

            x.onreadystatechange = function() {
                if (x.readyState !== 4) {
                    return;
                }

                if (x.readyState === 4 && x.status === 200) {
                    const stats = JSON.parse(x.responseText);

                    if (stats) {
                        Index.dclStats = stats;
                        setTimeout(() => {
                            Index.dclStats = void 0;
                        }, 300000);
                        resolve(stats);
                    } else {
                        reject(new Error());
                    }
                } else {
                    reject(new Error());
                }
            };

            x.open("GET", "api/dclStats", true);
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
            const responseText = await Index.readLocal(path, false);

            document.querySelector(element).innerText = responseText;
        } finally {
            setTimeout(() => {
                Index.updateDiv(element, path, interval);
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
            const responseText = await Index.readLocal(path, false),
                lines = responseText.split("\n");

            document.querySelector("#title-1").innerText = lines[0];
            document.querySelector("#title-2").innerText = lines[1];
        } finally {
            setTimeout(() => {
                Index.updateTitle(path, interval);
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
            let responseText = await Index.readLocal(path, false);

            if (Index.dcl) {
                const stats = await Index.getDcl();

                responseText = `Descent Champions Ladder Stats\nRank: ${stats.rating.replace(/^./, (s) => s.toUpperCase())} #${stats.rank}\nvs. Diamond: ${stats.records.diamond.wins}-${stats.records.diamond.losses}\nvs. Gold: ${stats.records.gold.wins}-${stats.records.gold.losses}\nvs. Silver: ${stats.records.silver.wins}-${stats.records.silver.losses}\nvs. Bronze: ${stats.records.bronze.wins}-${stats.records.bronze.losses}\nvs. Unrated: ${stats.records.unrated.wins}-${stats.records.unrated.losses}\n\n${stats.matches.length > 0 ? `Recent Games\n${stats.matches.slice(0, 5).map((match) => `${match.pilot.score > match.opponent.score ? "W" : "L"} ${match.pilot.score}-${match.opponent.score} vs. ${match.opponent.name}, ${match.game} ${match.map}`).join("\n")}` : ""}\n\n${responseText}`;
            }

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
                Index.updateText(path, interval);
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
            responseText = await Index.checkLastUpdate(path);

            if (responseText !== lastUpdated) {
                const imageData = await Index.readLocal(path, true);

                document.querySelector(element).src = `data:image/png;base64,${imageData}`;
            }
            return responseText;
        } finally {
            setTimeout(() => {
                Index.updateImage(element, path, interval, responseText || lastUpdated);
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

                if (Index.countdown) {
                    Index.countdown = false;
                    Index.songEndsAt = new Date().getTime() + response.duration - response.progress;
                    Index.updateCountdown();
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
                Index.updateSpotify(textElement, imageElement, interval);
            }, thisInterval || interval);
        }
    }

    //              #           #           ##   ##     #       #               #
    //              #           #          #  #   #             #               #
    // ###    ##   ###    ###  ###    ##    #     #    ##     ###   ##    ###   ###    ##   #  #
    // #  #  #  #   #    #  #   #    # ##    #    #     #    #  #  # ##  ##     #  #  #  #  #  #
    // #     #  #   #    # ##   #    ##    #  #   #     #    #  #  ##      ##   #  #  #  #  ####
    // #      ##     ##   # #    ##   ##    ##   ###   ###    ###   ##   ###    #  #   ##   ####
    /**
     * Rotates the slideshow to the next image.
     * @param {number} index The index of the next image to update to.
     * @returns {void}
     */
    static rotateSlideshow(index) {
        const bg = document.querySelector(".background");

        bg.classList.remove("animate");

        const newBg = bg.cloneNode(true);

        bg.parentNode.replaceChild(newBg, bg);
        ({[index]: document.querySelector(".bgImage").src} = slideshowImages);
        newBg.classList.add("animate");

        index++;
        if (index >= slideshowImages.length) {
            index = 0;
        }
        setTimeout(() => {
            Index.rotateSlideshow(index);
        }, 8000);
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
        requestAnimationFrame(Index.draw);

        if (document.getElementById("intro").classList.contains("hidden")) {
            return;
        }

        const buffer = new Uint8Array(Index.analyser.frequencyBinCount);

        Index.analyser.getByteFrequencyData(buffer);

        Index.canvasContext.clearRect(0, 0, 1920, 400);

        let x = 0;

        for (let i = 0; i < Index.analyser.frequencyBinCount; i++) {
            if (x >= 1920) {
                break;
            }

            const {[i]: barHeight} = buffer;

            Index.canvasContext.fillStyle = `rgb(${Index.red(x / 1920)}, ${Index.green(x / 1920)}, ${Index.blue(x / 1920)})`;
            Index.canvasContext.fillRect(x, 400 - 400 * barHeight / 255, 2500 / Index.analyser.frequencyBinCount - 1, 400 * barHeight / 255);
            x += 2500 / Index.analyser.frequencyBinCount;
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

        Index.analyser = audioContext.createAnalyser();
        Index.canvasContext = canvas.getContext("2d");

        Index.analyser.minDecibels = -100;
        Index.analyser.maxDecibels = -15;
        Index.analyser.smoothingTimeConstant = 0.65;
        Index.analyser.fftSize = 512;

        try {
            const devices = await navigator.mediaDevices.enumerateDevices(),
                device = devices.find((d) => d.kind === "audioinput");

            if (device) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({audio: {deviceId: {exact: device.deviceId}}, video: false}),
                        source = audioContext.createMediaStreamSource(stream);

                    source.connect(Index.analyser);

                    Index.canvasContext.clearRect(0, 0, 1920, 400);

                    Index.draw();
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
        Index.ws = new WebSocket(`ws://${document.location.hostname}:${document.location.port || "80"}/ws/listen`);
        Index.obs = new OBSWebSocket();

        Index.ws.onmessage = async (ev) => {
            const data = JSON.parse(ev.data),
                sound = document.getElementById("sound-fire");

            switch (data.type) {
                case "scene":
                    [].forEach.call(document.getElementsByClassName("scene"), (el) => {
                        el.classList.add("hidden");
                    });

                    document.getElementById("screen").classList.remove("green-screen");

                    switch (data.state) {
                        case "intro":
                            document.querySelector("#intro .upNext").classList.remove("hidden");
                            document.querySelector("#intro .thanks").classList.add("hidden");
                            document.getElementById("video").classList.add("hidden");
                            document.getElementById("intro").classList.remove("hidden");
                            document.getElementById("now-playing").style.transform = "translate(1418px, 5px)";
                            Spotify.setSpotifyVolume(100);
                            setTimeout(() => {
                                Index.countdown = true;
                                Spotify.playPlaylist("spotify:user:1211227601:playlist:6vC594uhppzSoqqmxhXy0A", true);
                            }, 15000);
                            Index.obs.setCurrentScene({"scene-name": "roncli Gaming - Bumper"});
                            break;
                        case "brb":
                            document.querySelector("#intro .upNext").classList.remove("hidden");
                            document.querySelector("#intro .thanks").classList.add("hidden");
                            document.querySelector("#intro .statusText").innerText = "Be right back!";
                            document.getElementById("video").classList.add("hidden");
                            document.getElementById("intro").classList.remove("hidden");
                            document.getElementById("now-playing").style.transform = "translate(1418px, 5px)";
                            Spotify.setSpotifyVolume(100);
                            try {
                                const response = await Spotify.readSpotify();

                                if (!response || !response.playing) {
                                    Spotify.playPlaylist("spotify:user:1211227601:playlist:6vC594uhppzSoqqmxhXy0A", false);
                                }
                            } catch (err) {
                                Spotify.playPlaylist("spotify:user:1211227601:playlist:6vC594uhppzSoqqmxhXy0A", false);
                            }
                            Index.obs.setCurrentScene({"scene-name": "roncli Gaming - Bumper"});
                            break;
                        case "thanks":
                            document.querySelector("#intro .upNext").classList.add("hidden");
                            document.querySelector("#intro .thanks").classList.remove("hidden");
                            document.querySelector("#intro .statusText").innerText = "";
                            document.getElementById("video").classList.add("hidden");
                            document.getElementById("intro").classList.remove("hidden");
                            document.getElementById("now-playing").style.transform = "translate(1418px, 5px)";
                            Spotify.setSpotifyVolume(100);
                            try {
                                const response = await Spotify.readSpotify();

                                if (!response || !response.playing) {
                                    Spotify.playPlaylist("spotify:user:1211227601:playlist:6vC594uhppzSoqqmxhXy0A", false);
                                }
                            } catch (err) {
                                Spotify.playPlaylist("spotify:user:1211227601:playlist:6vC594uhppzSoqqmxhXy0A", false);
                            }
                            Index.obs.setCurrentScene({"scene-name": "roncli Gaming - Bumper"});
                            break;
                        case "fullscreen":
                            Index.goFullscreen();
                            Index.obs.setCurrentScene({"scene-name": "roncli Gaming - Full Screen"});
                            break;
                        case "scene":
                            document.getElementById("scene").classList.remove("hidden");
                            document.getElementById("scene").style.transform = "translate(0px, 0px)";
                            document.getElementById("now-playing").style.transform = "translate(1418px, 5px)";
                            document.getElementById("video").classList.remove("hidden");
                            document.getElementById("video").style.maxWidth = "369px";
                            document.getElementById("webcam").style.transform = "translate(-80px, 800px) scale(0.26)";
                            document.getElementById("fire").style.transform = "translate(0px, 869px)";
                            setTimeout(() => {
                                document.getElementById("screen").classList.add("green-screen");
                            }, 1000);
                            Spotify.setSpotifyVolume(50);
                            Index.obs.setCurrentScene({"scene-name": data.scene});
                            break;
                    }
                    break;
                case "action":
                    switch (data.action) {
                        case "fire":
                            sound.volume = 1;
                            sound.play();

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
                        case "dcl":
                            Index.dcl = !Index.dcl;
                            break;
                    }
                    break;
            }
        };

        Index.obs.connect(config.websocket);
    }

    //             ####        ##    ##
    //             #            #     #
    //  ###   ##   ###   #  #   #     #     ###    ##   ###    ##    ##   ###
    // #  #  #  #  #     #  #   #     #    ##     #     #  #  # ##  # ##  #  #
    //  ##   #  #  #     #  #   #     #      ##   #     #     ##    ##    #  #
    // #      ##   #      ###  ###   ###   ###     ##   #      ##    ##   #  #
    //  ###
    /**
     * Switches to full screen mode.
     * @returns {void}
     */
    static goFullscreen() {
        document.getElementById("fullscreen").classList.remove("hidden");
        document.getElementById("now-playing").style.transform = "translate(1418px, 5px)";
        document.getElementById("video").style.maxWidth = "1920px";
        document.getElementById("video").classList.remove("hidden");
        document.getElementById("webcam").style.transform = "translate(0, 0) scale(1)";
    }

    //                #         #           ##                      #       #
    //                #         #          #  #                     #       #
    // #  #  ###    ###   ###  ###    ##   #      ##   #  #  ###   ###    ###   ##   #  #  ###
    // #  #  #  #  #  #  #  #   #    # ##  #     #  #  #  #  #  #   #    #  #  #  #  #  #  #  #
    // #  #  #  #  #  #  # ##   #    ##    #  #  #  #  #  #  #  #   #    #  #  #  #  ####  #  #
    //  ###  ###    ###   # #    ##   ##    ##    ##    ###  #  #    ##   ###   ##   ####  #  #
    //       #
    /**
     * Updates the countdown text.
     * @returns {void}
     */
    static updateCountdown() {
        const timeLeft = new Date(Index.songEndsAt - new Date().getTime() - 10000),
            statusText = document.querySelector("#intro .statusText");

        if (timeLeft.getTime() < 0) {
            [].forEach.call(document.getElementsByClassName("scene"), (el) => {
                el.classList.add("hidden");
            });

            statusText.innerText = "00:00:00";

            Index.goFullscreen();
            Index.obs.setCurrentScene({"scene-name": "roncli Gaming - Full Screen"});
            return;
        }

        statusText.innerText = timeLeft.toLocaleDateString("en-us", {timeZone: "UTC", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit"}).split(" ")[1];

        setTimeout(() => {
            Index.updateCountdown();
        }, timeLeft.getTime() % 1000 + 1);
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
        Index.rotateSlideshow(0);
        Index.analyzer();
        Index.updateDiv(".unGame", "C:\\Users\\roncli\\Desktop\\roncliGaming\\roncliGamingUpNext.txt", 5000);
        Index.updateText("C:\\Users\\roncli\\Desktop\\roncliGaming\\roncliGamingStreamText.txt", 5000);
        Index.updateTitle("C:\\Users\\roncli\\Desktop\\roncliGaming\\roncliGamingUpNext.txt", 5000);
        Index.updateSpotify(".track-text", ".album-art", 5000);
        Index.startWebsockets();
        Index.updateVideo("#webcam");
    }
}

document.addEventListener("DOMContentLoaded", Index.DOMContentLoaded);
