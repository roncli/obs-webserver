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
}

document.addEventListener("DOMContentLoaded", (ev) => {
    Index.positionContainer();
    Index.updateVideo("#video");
    Index.updateDiv(".stream-text", "C:\\Users\\roncli\\Desktop\\roncliGaming\\roncliGamingStreamText.txt", 5000);
    Index.updateSpotify(".track-text", ".album-art", 1000);
    Index.rotateSlideshow(0);
});
