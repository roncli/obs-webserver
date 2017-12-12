var positionContainer = function() {
    var css = [].slice.call([].slice.call(document.styleSheets).find(function(ss) {return ss.href === null;}).rules).find(function(rule) {return rule.selectorText === ".container";});
    if (css) {
        var params = new URLSearchParams(location.search.slice(1));
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

var updateVideo = function(el) {
    var video = document.querySelector(el);

    var device = navigator.mediaDevices.enumerateDevices().then((devices) => {
        var deviceId = devices.filter((d) => d.kind === "videoinput" && d.label.startsWith("Logitech HD Pro Webcam C920"))[0].deviceId;

        navigator.webkitGetUserMedia({
            video: {mandatory: {minWidth: 1920, minHeight: 1080}, optional: [{sourceId: deviceId}]}
        }, function(stream) {
            video.src = window.URL.createObjectURL(stream);
        }, function(ex) {
            console.log(ex);
        });
    });
};

var updateDiv = function(element, path, interval) {
    var readLocal = function() {
        var x = new XMLHttpRequest();
        x.onreadystatechange = function() {
            if (x.readyState == 4 && x.status == 200) {
                document.querySelector(element).innerText = x.responseText;

                setTimeout(readLocal, interval);
            }
        };
        x.open("POST", "api/local", true);
        x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        x.send("file=" + encodeURIComponent(path));
    };

    readLocal();
};

var updateImage = function(element, path, interval) {
    var lastUpdated = null,

        readLocal = function() {
            var x = new XMLHttpRequest();
            x.onreadystatechange = function() {
                if (x.readyState == 4 && x.status == 200) {
                    document.querySelector(element).src = "data:image/png;base64," + x.responseText;
                }
            };
            x.open("POST", "api/local", true);
            x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            x.send("base64=true&file=" + encodeURIComponent(path));
        },

        checkLastUpdate = function() {
            var x = new XMLHttpRequest();
            x.timeout = 5000;

            x.onreadystatechange = function() {
                if (x.readyState === 4 && x.status === 200) {
                    if (x.responseText !== lastUpdated) {
                        lastUpdated = x.responseText;
                        readLocal();
                    }

                    setTimeout(checkLastUpdate, interval);
                }
            };

            x.ontimeout = function() {
                setTimeout(checkLastUpdate, 10000);
            };

            x.onerror = function() {
                setTimeout(checkLastUpdate, 10000);
            };

            x.open("POST", "api/lastModified", true);
            x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            x.send("file=" + encodeURIComponent(path));
        };

    checkLastUpdate();
};

var updateSpotify = function(textElement, imageElement, interval) {
    var readSpotify = function() {
        var x = new XMLHttpRequest();
        x.timeout = 5000;

        x.onreadystatechange = function() {
            var response;

            if (x.readyState === 4 && x.status === 200) {
                response = JSON.parse(x.responseText);
                if (response.item) {
                    document.querySelector(textElement).innerText = (response.item.artists && response.item.artists[0] && response.item.artists[0].name && response.item.name ? "Now Playing:\n" + response.item.artists[0].name + " - " + response.item.name : "");
                    if (response.item.album && response.item.album.images && response.item.album.images[0]) {
                        if (response.item.album.images[0].url !== document.querySelector(imageElement).src) {
                            document.querySelector(imageElement).src = response.item.album.images[0].url;
                            document.querySelector(imageElement).classList.remove("hidden");
                        }
                    } else {
                        document.querySelector(imageElement).src = "";
                        document.querySelector(imageElement).classList.add("hidden");
                    }
                    setTimeout(readSpotify, Math.min((1000 + response.item.duration_ms - response.progress_ms) || 10000, 10000));
                } else {
                    setTimeout(readSpotify, 10000);
                }
            }
        };

        x.ontimeout = function() {
            document.querySelector(textElement).innerText = "";
            document.querySelector(imageElement).src = "";
            document.querySelector(imageElement).classList.add("hidden")
            
            setTimeout(readSpotify, 10000);
        };

        x.onerror = function() {
            document.querySelector(textElement).innerText = "";
            document.querySelector(imageElement).src = "";
            document.querySelector(imageElement).classList.add("hidden")
            
            setTimeout(readSpotify, 10000);
        }

        x.open("GET", "api/spotifyNowPlaying", true);
        x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        x.send();
    };

    readSpotify();
};