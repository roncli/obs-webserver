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

    //                      #   ##                #     #      #
    //                      #  #  #               #           # #
    // ###    ##    ###   ###   #    ###    ##   ###   ##     #    #  #
    // #  #  # ##  #  #  #  #    #   #  #  #  #   #     #    ###   #  #
    // #     ##    # ##  #  #  #  #  #  #  #  #   #     #     #     # #
    // #      ##    # #   ###   ##   ###    ##     ##  ###    #      #
    //                               #                              #
    /**
     * Reads now playing information from Spotify.
     * @returns {Promise} A promise that resolves with the Spotify information.
     */
    static readSpotify() {
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

            x.open("GET", "api/spotifyNowPlaying", true);
            x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            x.send();
        });
    }

    //       ##                ###   ##                ##     #            #
    //        #                #  #   #                 #                  #
    // ###    #     ###  #  #  #  #   #     ###  #  #   #    ##     ###   ###
    // #  #   #    #  #  #  #  ###    #    #  #  #  #   #     #    ##      #
    // #  #   #    # ##   # #  #      #    # ##   # #   #     #      ##    #
    // ###   ###    # #    #   #     ###    # #    #   ###   ###   ###      ##
    // #                  #                       #
    /**
     * Plays a Spotify playlist.
     * @param {string} playlist The Spotify Uri of the playlist to play.
     * @param {boolean} stop Whether to stop the playlist after one song.
     * @returns {void}
     */
    static playPlaylist(playlist, stop) {
        const x = new XMLHttpRequest();

        x.timeout = 5000;
        x.open("POST", "api/spotifyPlay", true);
        x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        x.send(`playlist=${playlist}${stop ? "&stop=true" : ""}`);
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

    //                     #     #     #                 ##                #           #
    //                           #                      #  #               #
    // ###    ##    ###   ##    ###   ##     ##   ###   #      ##   ###   ###    ###  ##    ###    ##   ###
    // #  #  #  #  ##      #     #     #    #  #  #  #  #     #  #  #  #   #    #  #   #    #  #  # ##  #  #
    // #  #  #  #    ##    #     #     #    #  #  #  #  #  #  #  #  #  #   #    # ##   #    #  #  ##    #
    // ###    ##   ###    ###     ##  ###    ##   #  #   ##    ##   #  #    ##   # #  ###   #  #   ##   #
    // #
    /**
     * Positions the container.
     * @param {object} options The positioning options.
     * @returns {void}
     */
    static positionContainer(options) {
        const css = [].slice.call([].slice.call(document.styleSheets).find((ss) => ss.href === null).rules).find((rule) => rule.selectorText === ".container");
        if (css) {
            if (options.top) {
                ({top: css.style.top} = options);
            }
            if (options.left) {
                ({left: css.style.left} = options);
                css.style.right = "";
            } else if (options.right) {
                css.style.left = "";
                ({right: css.style.right} = options);
            }
        }
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
        Index.readSpotify().then((responseText) => {
            const response = JSON.parse(responseText),
                image = document.querySelector(imageElement);

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
    };

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
            Index.analyser.connect(audioContext.destination);

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
        Index.ws = new WebSocket("ws://localhost:60578/listen");

        Index.ws.onmessage = (ev) => {
            const {data} = ev;

            if (data.type === "state") {
                [].forEach.call(document.getElementsByClassName("scenes"), (el) => {
                    el.classList.add("hidden");
                });

                switch (data.state) {
                    case "intro":
                        document.getElementById("intro").classList.remove("hidden");
                        setTimeout(() => {
                            Index.countdown = true;
                            Index.playPlaylist("spotify:user:1211227601:playlist:6vC594uhppzSoqqmxhXy0A", true);
                        }, 15000);
                        break;
                    case "brb":
                        document.querySelector("#intro .statusText").innerText = "Be right back!";
                        document.getElementById("intro").classList.remove("hidden");
                        Index.playPlaylist("spotify:user:1211227601:playlist:6vC594uhppzSoqqmxhXy0A", false);
                }
            }
        };
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
        const timeLeft = new Date(Index.songEndsAt - new Date().getTime()),
            statusText = document.querySelector("#intro .statusText");

        if (timeLeft.getTime() < 0) {
            statusText.innerText = "00:00:00";
            return;
        }

        statusText.innerText = timeLeft.toLocaleDateString("en-us", {timeZone: "UTC", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit"}).split(" ")[1];

        setTimeout(() => {
            Index.updateCountdown();
        }, timeLeft.getTime() % 1000 + 1);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    Index.rotateSlideshow(0);
    Index.analyzer();
    Index.updateDiv(".unGame", "C:\\Users\\roncli\\Desktop\\roncliGaming\\roncliGamingUpNext.txt", 5000);
    Index.updateDiv(".stream-text", "C:\\Users\\roncli\\Desktop\\roncliGaming\\roncliGamingStreamText.txt", 5000);
    Index.updateSpotify(".track-text", ".album-art", 5000);
    Index.startWebsocket();

    return;

    Index.positionContainer({top: 100});
    Index.updateVideo("#video");
});
