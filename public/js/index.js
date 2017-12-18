const slideshowImages = [
    "images/crypt.png",
    "images/descent.png",
    "images/diablo3.png",
    "images/overwatch.png",
    "images/sl0.png",
    "images/wow.png"
];

class Index {
    static readLocal(path, base64) {
        return new Promise((resolve, reject) => {
            const x = new XMLHttpRequest();

            x.onreadystatechange = () => {
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

    static readSpotify() {
        return new Promise((resolve, reject) => {
            const x = new XMLHttpRequest();

            x.timeout = 5000;
            x.onreadystatechange = () => {
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

    static checkLastUpdate(path) {
        return new Promise((resolve, reject) => {
            const x = new XMLHttpRequest();

            x.timeout = 5000;
            x.onreadystatechange = () => {
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

    static positionContainer() {
        const css = [].slice.call([].slice.call(document.styleSheets).find((ss) => ss.href === null).rules).find((rule) => rule.selectorText === ".container");
        if (css) {
            const params = new URLSearchParams(location.search.slice(1));
            if (params.get("top")) {
                css.style.top = params.get("top");
            }
            if (params.get("left")) {
                css.style.left = params.get("left");
                css.style.right = "";
            }
            if (params.get("right")) {
                css.style.left = "";
                css.style.right = params.get("right");
            }
        }
    }

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

    static updateDiv(element, path, interval) {
        Index.readLocal(path, false).then((responseText) => {
            document.querySelector(element).innerText = responseText;
        }).catch(() => {}).then(() => {
            setTimeout(() => {
                Index.updateDiv(element, path, interval);
            }, interval);
        });
    }

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

    static updateSpotify(textElement, imageElement, interval) {
        Index.readSpotify().then((responseText) => {
            const response = JSON.parse(responseText);

            if (response.playing) {
                const image = document.querySelector(imageElement);

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

                return Math.min(1000 + response.duration - response.progress || interval, interval);
            }

            return void 0;
        }).catch(() => {}).then((thisInterval) => {
            setTimeout(() => {
                Index.updateSpotify(textElement, imageElement, interval);
            }, thisInterval || interval);
        });
    }

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
    }

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
    }

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
    }

    static analyzer() {
        const audioContext = new window.AudioContext(),
            analyser = audioContext.createAnalyser(),
            canvas = document.getElementById("analyzer"),
            canvasCtx = canvas.getContext("2d");

        analyser.minDecibels = -100;
        analyser.maxDecibels = -15;
        analyser.smoothingTimeConstant = 0.3;
        analyser.fftSize = 512;

        navigator.getUserMedia(
            {audio: true},
            (stream) => {
                const source = audioContext.createMediaStreamSource(stream),
                    dataArrayAlt = new Uint8Array(analyser.frequencyBinCount);

                source.connect(analyser);
                analyser.connect(audioContext.destination);

                canvasCtx.clearRect(0, 0, 1920, 200);

                const drawAlt = () => {
                    requestAnimationFrame(drawAlt);

                    analyser.getByteFrequencyData(dataArrayAlt);

                    canvasCtx.fillStyle = "rgb(0, 0, 0)";
                    canvasCtx.fillRect(0, 0, 1920, 200);

                    let x = 0;

                    for (let i = 0; i < analyser.frequencyBinCount; i++) {
                        if (x >= 1920) {
                            break;
                        }

                        const {[i]: barHeight} = dataArrayAlt;

                        canvasCtx.fillStyle = `rgb(${Index.red(x / 1920)}, ${Index.green(x / 1920)}, ${Index.blue(x / 1920)})`;
                        canvasCtx.fillRect(x, 200 - barHeight / 2, 2500 / analyser.frequencyBinCount - 1, barHeight / 2);

                        x += 2500 / analyser.frequencyBinCount;
                    }
                };

                drawAlt();
            },
            () => {}
        );
    }
}

document.addEventListener("DOMContentLoaded", (ev) => {
    Index.analyzer();
    Index.positionContainer();
    Index.updateVideo("#video");
    Index.updateDiv(".stream-text", "C:\\Users\\roncli\\Desktop\\roncliGaming\\roncliGamingStreamText.txt", 5000);
    Index.updateSpotify(".track-text", ".album-art", 1000);
    Index.rotateSlideshow(0);
});
