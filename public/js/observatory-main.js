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
        x.open("GET", `api/local?file=${encodeURIComponent(path)}`, true);
        x.send();
    };

    readLocal();
};

var ws = new WebSocket("ws://localhost:42423");

ws.onopen = () => {
    ws.send(JSON.stringify({type: "standings"}));
};

ws.onmessage = (ev) => {
    var msg = JSON.parse(ev.data);

    switch (msg.type) {
        case "match":
            break;
        case "standings":
            document.getElementById("data").innerHTML = msg.players.map((p) => p.score + " - " + p.name + (p.home ? " - " + p.home.join(", ") : "")).join("<br />")
            break;
        case "results":
        case "addplayer":
        case "home":
            ws.send(JSON.stringify({type: "standings"}));
            break;
    }
};
