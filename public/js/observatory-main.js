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
