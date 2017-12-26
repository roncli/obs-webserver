/* global Spotify */

const slideshowImages = [
    "images/crypt.png",
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
     * @returns {Promise} A promise that resolves with the contents of the file.
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
            x.open("POST", "api/local", true);
            x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            x.send(`${base64 ? "base64=true&" : ""}file=${encodeURIComponent(path)}`);
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
     * @returns {Promise} A promise that resolves with the last update date of the file.
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

            x.open("POST", "api/lastModified", true);
            x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            x.send(`file=${encodeURIComponent(path)}`);
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
     * @returns {void}
     */
    static updateVideo(element) {
        const video = document.querySelector(element);

        navigator.mediaDevices.enumerateDevices().then((devices) => {
            const {deviceId} = devices.filter((d) => d.kind === "videoinput" && d.label.startsWith("Logitech HD Pro Webcam C920"))[0];

            navigator.webkitGetUserMedia({
                video: {
                    mandatory: {
                        minWidth: 1920,
                        minHeight: 1080
                    },
                    optional: [{sourceId: deviceId}]
                }
            }, (stream) => {
                video.src = window.URL.createObjectURL(stream);
            }, (err) => {
                console.log(err);
            });
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
     * @returns {void}
     */
    static updateDiv(element, path, interval) {
        Index.readLocal(path, false).then((responseText) => {
            document.querySelector(element).innerText = responseText;
        }).catch(() => {}).then(() => {
            setTimeout(() => {
                Index.updateDiv(element, path, interval);
            }, interval);
        });
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
     * @returns {void}
     */
    static updateImage(element, path, interval, lastUpdated) {
        Index.checkLastUpdate(path).then((responseText) => {
            if (responseText !== lastUpdated) {
                Index.readLocal(path, true).then((imageData) => {
                    document.querySelector(element).src = `data:image/png;base64,${imageData}`;
                });
            }
            return responseText;
        }).catch(() => {}).then((responseText) => {
            setTimeout(() => {
                Index.updateImage(element, path, interval, responseText || lastUpdated);
            }, interval);
        });
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
     * @returns {void}
     */
    static updateSpotify(textElement, imageElement, interval) {
        Spotify.readSpotify().then((response) => {
            const image = document.querySelector(imageElement);

            if (response.playing) {
                document.querySelector(textElement).innerText = `Now Playing:\n${response.artist} - ${response.title}`;
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

                return Math.min(1000 + response.duration - response.progress || interval, interval);
            }

            document.querySelector(textElement).innerText = "";
            image.src = "";
            image.classList.add("hidden");

            return void 0;
        }).catch(() => {}).then((thisInterval) => {
            setTimeout(() => {
                Index.updateSpotify(textElement, imageElement, interval);
            }, thisInterval || interval);
        });
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
     * @returns {void}
     */
    static analyzer() {
        const audioContext = new window.AudioContext(),
            canvas = document.getElementById("analyzer");

        Index.analyser = audioContext.createAnalyser();
        Index.canvasContext = canvas.getContext("2d");

        Index.analyser.minDecibels = -100;
        Index.analyser.maxDecibels = -15;
        Index.analyser.smoothingTimeConstant = 0.65;
        Index.analyser.fftSize = 512;

        navigator.getUserMedia({audio: true}, (stream) => {
            const source = audioContext.createMediaStreamSource(stream);

            source.connect(Index.analyser);

            Index.canvasContext.clearRect(0, 0, 1920, 400);

            Index.draw();
        }, () => {});
    }

    //         #                 #    #  #        #                        #            #
    //         #                 #    #  #        #                        #            #
    //  ###   ###    ###  ###   ###   #  #   ##   ###    ###    ##    ##   # #    ##   ###
    // ##      #    #  #  #  #   #    ####  # ##  #  #  ##     #  #  #     ##    # ##   #
    //   ##    #    # ##  #      #    ####  ##    #  #    ##   #  #  #     # #   ##     #
    // ###      ##   # #  #       ##  #  #   ##   ###   ###     ##    ##   #  #   ##     ##
    /**
     * Starts the WebSocket connection and performs updates based on the messages received.
     * @returns {void}
     */
    static startWebsocket() {
        Index.ws = new WebSocket(`ws://${document.location.hostname}:${document.location.port || "80"}/ws/listen`);

        Index.ws.onmessage = (ev) => {
            const data = JSON.parse(ev.data),
                sound = document.getElementById("sound-fire");

            switch (data.type) {
                case "scene":
                    [].forEach.call(document.getElementsByClassName("scene"), (el) => {
                        el.classList.add("hidden");
                    });

                    switch (data.state) {
                        case "intro":
                            document.querySelector("#intro .upNext").classList.remove("hidden");
                            document.querySelector("#intro .thanks").classList.add("hidden");
                            document.getElementById("video").classList.add("hidden");
                            document.querySelector("#video .roncliGaming").classList.add("hidden");
                            document.getElementById("intro").classList.remove("hidden");
                            document.getElementById("now-playing").style.transform = "translate(1534px, 1019px)";
                            document.getElementById("streamlabs").style.transform = "translate(0, 0)";
                            Spotify.setSpotifyVolume(100);
                            setTimeout(() => {
                                Index.countdown = true;
                                Spotify.playPlaylist("spotify:user:1211227601:playlist:6vC594uhppzSoqqmxhXy0A", true);
                            }, 15000);
                            break;
                        case "brb":
                            document.querySelector("#intro .upNext").classList.remove("hidden");
                            document.querySelector("#intro .thanks").classList.add("hidden");
                            document.querySelector("#intro .statusText").innerText = "Be right back!";
                            document.getElementById("video").classList.add("hidden");
                            document.querySelector("#video .roncliGaming").classList.add("hidden");
                            document.getElementById("intro").classList.remove("hidden");
                            document.getElementById("now-playing").style.transform = "translate(1534px, 1019px)";
                            document.getElementById("streamlabs").style.transform = "translate(0, 0)";
                            Spotify.setSpotifyVolume(100);
                            Spotify.readSpotify().then((response) => {
                                if (!response || !response.playing) {
                                    Spotify.playPlaylist("spotify:user:1211227601:playlist:6vC594uhppzSoqqmxhXy0A", false);
                                }
                            }).catch(() => {
                                Spotify.playPlaylist("spotify:user:1211227601:playlist:6vC594uhppzSoqqmxhXy0A", false);
                            });
                            break;
                        case "thanks":
                            document.querySelector("#intro .upNext").classList.add("hidden");
                            document.querySelector("#intro .thanks").classList.remove("hidden");
                            document.querySelector("#intro .statusText").innerText = "";
                            document.getElementById("video").classList.add("hidden");
                            document.querySelector("#video .roncliGaming").classList.add("hidden");
                            document.getElementById("intro").classList.remove("hidden");
                            document.getElementById("now-playing").style.transform = "translate(1534px, 1019px)";
                            document.getElementById("streamlabs").style.transform = "translate(0, 0)";
                            Spotify.setSpotifyVolume(100);
                            Spotify.readSpotify().then((response) => {
                                if (!response || !response.playing) {
                                    Spotify.playPlaylist("spotify:user:1211227601:playlist:6vC594uhppzSoqqmxhXy0A", false);
                                }
                            }).catch(() => {
                                Spotify.playPlaylist("spotify:user:1211227601:playlist:6vC594uhppzSoqqmxhXy0A", false);
                            });
                            break;
                        case "fullscreen":
                            Index.goFullscreen();
                            break;
                        case "dcl":
                            document.getElementById("dcl").classList.remove("hidden");
                            document.getElementById("scene").classList.remove("hidden");
                            document.getElementById("scene").style.transform = "translate(0px, 298px)";
                            document.getElementById("now-playing").style.transform = "translate(0px, 754px)";
                            document.getElementById("video").classList.remove("hidden");
                            document.querySelector("#video .roncliGaming").classList.remove("hidden");
                            document.querySelector("#video .roncliGaming").style.transform = "translate(277px, 603px)";
                            document.getElementById("webcam").style.transform = "translate(0px, 598px) scale(0.2)";
                            document.getElementById("streamlabs").style.transform = "translate(0px, 598px)";
                            document.getElementById("fire").style.transform = "translate(0px, 603px)";
                            Index.updateDcl();
                            break;
                        case "scene":
                            document.getElementById("scene").classList.remove("hidden");
                            document.getElementById("scene").style.transform = `translate(${data.scene.position.left}px, ${data.scene.position.top}px)`;
                            document.getElementById("now-playing").style.transform = `translate(${data.scene.position.left}px, ${data.scene.position.top + 456}px)`;
                            document.getElementById("video").classList.remove("hidden");
                            document.querySelector("#video .roncliGaming").classList.remove("hidden");
                            document.querySelector("#video .roncliGaming").style.transform = `translate(${data.scene.position.left + 277}px, ${data.scene.position.top + 305}px)`;
                            document.getElementById("webcam").style.transform = `translate(${data.scene.position.left}px, ${data.scene.position.top + 300}px) scale(0.2)`;
                            document.getElementById("streamlabs").style.transform = `translate(${data.scene.position.left}px, ${data.scene.position.top + 300}px)`;
                            document.getElementById("fire").style.transform = `translate(${data.scene.position.left}px, ${data.scene.position.top + 305}px)`;
                            Spotify.setSpotifyVolume(50);
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
                            document.getElementById("time").classList.add("fade-animation");

                            setTimeout(() => {
                                document.getElementById("time").classList.remove("fade-animation");
                            }, 12000);
                            break;
                    }
                    break;
            }
        };
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
        document.getElementById("now-playing").style.transform = "translate(1534px, 1019px)";
        document.getElementById("video").classList.remove("hidden");
        document.querySelector("#video .roncliGaming").classList.add("hidden");
        document.getElementById("webcam").style.transform = "translate(0, 0) scale(1)";
        document.getElementById("streamlabs").style.transform = "translate(0, 0)";
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
        const timeLeft = new Date(Index.songEndsAt - new Date().getTime() - 15000),
            statusText = document.querySelector("#intro .statusText");

        if (timeLeft.getTime() < 0) {
            [].forEach.call(document.getElementsByClassName("scene"), (el) => {
                el.classList.add("hidden");
            });

            statusText.innerText = "00:00:00";

            Index.goFullscreen();
            return;
        }

        statusText.innerText = timeLeft.toLocaleDateString("en-us", {timeZone: "UTC", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit"}).split(" ")[1];

        setTimeout(() => {
            Index.updateCountdown();
        }, timeLeft.getTime() % 1000 + 1);
    }

    //                #         #          ###         ##
    //                #         #          #  #         #
    // #  #  ###    ###   ###  ###    ##   #  #   ##    #
    // #  #  #  #  #  #  #  #   #    # ##  #  #  #      #
    // #  #  #  #  #  #  # ##   #    ##    #  #  #      #
    //  ###  ###    ###   # #    ##   ##   ###    ##   ###
    //       #
    /**
     * Updates the DCL stats.
     * @returns {void}
     */
    static updateDcl() {
        if (Index.updateDclTimeout) {
            clearTimeout(Index.updateDclTimeout);
        }

        if (document.querySelector("#dcl").classList.contains("hidden")) {
            return;
        }

        const x = new XMLHttpRequest();

        x.onreadystatechange = function() {
            if (x.readyState === 4 && x.status === 200) {
                const stats = JSON.parse(x.responseText);

                if (stats) {
                    const games = document.querySelector("#dcl .games");

                    document.querySelector("#dcl .dcl .rank").innerText = `${stats.rating} #${stats.rank}`;
                    document.querySelector("#dcl .dcl .diamond").innerText = `${stats.records.diamond.wins}-${stats.records.diamond.losses}`;
                    document.querySelector("#dcl .dcl .gold").innerText = `${stats.records.gold.wins}-${stats.records.gold.losses}`;
                    document.querySelector("#dcl .dcl .silver").innerText = `${stats.records.silver.wins}-${stats.records.silver.losses}`;
                    document.querySelector("#dcl .dcl .bronze").innerText = `${stats.records.bronze.wins}-${stats.records.bronze.losses}`;
                    document.querySelector("#dcl .dcl .unrated").innerText = `${stats.records.unrated.wins}-${stats.records.unrated.losses}`;

                    while (games.firstChild) {
                        games.removeChild(games.firstChild);
                    }

                    for (let index = 0; index < 5 && index < stats.matches.length; index++) {
                        const {matches: {[index]: match}} = stats,
                            div = document.createElement("div");

                        div.innerText = `${match.pilot.score > match.opponent.score ? "W" : "L"} ${match.pilot.score}-${match.opponent.score} vs. ${match.opponent.name}, ${match.game} ${match.map}`;
                        games.appendChild(div);
                    }
                    document.getElementById("dcl").classList.remove("hidden");
                } else {
                    document.getElementById("dcl").classList.add("hidden");
                }

                Index.updateDclTimeout = setTimeout(Index.updateDcl, 300000);
            }
        };

        x.open("GET", "api/dclStats", true);
        x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        x.send();
    }
}

// ###    ##   #  #   ##                #                 #    #                    #           #
// #  #  #  #  ####  #  #               #                 #    #                    #           #
// #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
// #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
// #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
// ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
document.addEventListener("DOMContentLoaded", () => {
    Index.rotateSlideshow(0);
    Index.analyzer();
    Index.updateDiv(".unGame", "C:\\Users\\roncli\\Desktop\\roncliGaming\\roncliGamingUpNext.txt", 5000);
    Index.updateDiv(".stream-text", "C:\\Users\\roncli\\Desktop\\roncliGaming\\roncliGamingStreamText.txt", 5000);
    Index.updateSpotify(".track-text", ".album-art", 5000);
    Index.startWebsocket();
    Index.updateVideo("#webcam");
});
