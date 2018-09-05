//   ###                  #                    ##
//  #   #                 #                     #
//  #       ###   # ##   ####   # ##    ###     #
//  #      #   #  ##  #   #     ##  #  #   #    #
//  #      #   #  #   #   #     #      #   #    #
//  #   #  #   #  #   #   #  #  #      #   #    #
//   ###    ###   #   #    ##   #       ###    ###
/**
 * A class of static functions for the control page.
 */
class Control {
    //         #                 #    #  #        #                        #            #
    //         #                 #    #  #        #                        #            #
    //  ###   ###    ###  ###   ###   #  #   ##   ###    ###    ##    ##   # #    ##   ###
    // ##      #    #  #  #  #   #    ####  # ##  #  #  ##     #  #  #     ##    # ##   #
    //   ##    #    # ##  #      #    ####  ##    #  #    ##   #  #  #     # #   ##     #
    // ###      ##   # #  #       ##  #  #   ##   ###   ###     ##    ##   #  #   ##     ##
    /**
     * Starts the WebSocket connection.
     * @returns {void}
     */
    static startWebsocket() {
        Control.ws = new WebSocket("ws://" + document.location.hostname + ":" + (document.location.port || "80") + "/ws/update");

        Control.ws.onmessage = function(ev) {
            var data = JSON.parse(ev.data),
                obsScenesList = document.getElementById("obs-scenes-list"),
                channelList = document.getElementById("channel-list"),
                musicList = document.getElementById("music-list"),
                sceneList = document.getElementById("scene-list"),
                layoutList = document.getElementById("nd-layout-list");

            switch (data.type) {
                case "settings":
                    data.data["obs-scenes"].forEach(function(scene) {
                        var option = document.createElement("option");

                        option.text = scene.name;
                        option.value = JSON.stringify(scene);

                        obsScenesList.appendChild(option);
                    });

                    data.data.channels.forEach(function(channel) {
                        var option = document.createElement("option");

                        option.text = channel.name;
                        option.value = channel.guildId + "/" + channel.channelId;

                        channelList.appendChild(option);
                    });

                    data.data.playlists.forEach(function(playlist) {
                        var option = document.createElement("option");

                        option.text = playlist.name;
                        option.value = playlist.value;

                        musicList.appendChild(option);
                    });

                    data.data.scenes.forEach(function(scene) {
                        var option = document.createElement("option");

                        option.text = scene.name;
                        option.value = scene.value;

                        sceneList.appendChild(option);
                    });

                    data.data["nd-layouts"].forEach(function(layout) {
                        var option = document.createElement("option");

                        option.text = layout.name;
                        option.value = layout.value;

                        layoutList.appendChild(option);
                    });
                    break;
            }
        };
    }

    // ##                   #   ##         #              #        ##
    //  #                   #  #  #        #              #         #
    //  #     ##    ###   ###   #     ##   ###    ##    ###  #  #   #     ##
    //  #    #  #  #  #  #  #    #   #     #  #  # ##  #  #  #  #   #    # ##
    //  #    #  #  # ##  #  #  #  #  #     #  #  ##    #  #  #  #   #    ##
    // ###    ##    # #   ###   ##    ##   #  #   ##    ###   ###  ###    ##
    /**
     * Loads the CoNDOR event schedule.
     * @returns {void}
     */
    static loadSchedule() {
        var x = new XMLHttpRequest(),
            data, scheduleList;

        x.onreadystatechange = function() {
            if (x.readyState !== 4) {
                return;
            }

            if (x.readyState === 4 && x.status === 200) {
                data = JSON.parse(x.responseText);

                Control.event = data.name;
                scheduleList = document.getElementById("nd-schedule-list");

                data.upcomingMatches.slice(0, 10).forEach(function(match) {
                    var option = document.createElement("option");

                    option.text = match.player1 + " vs " + match.player2 + " - " + match.dateStr + (match.cawmentary ? " - " + match.cawmentary : "");
                    option.value = JSON.stringify(match);

                    scheduleList.appendChild(option);
                });
            }
        };
        x.open("GET", "api/necrodancercondorevent", true);
        x.send();
    }

    // ###    ##   #  #   ##                #                 #    #                    #           #
    // #  #  #  #  ####  #  #               #                 #    #                    #           #
    // #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
    // #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
    // #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
    // ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
    /**
     * Starts up the control page.
     * @returns {void}
     */
    static DOMContentLoaded() {
        Control.startWebsocket();

        document.getElementById("obs-scenes-select").onclick = function() {
            var obsScenesList = document.getElementById("obs-scenes-list"),
                scene = JSON.parse(obsScenesList.options[obsScenesList.selectedIndex].value);

            Control.ws.send(JSON.stringify({
                type: "obs-scene",
                scene: scene.scene
            }));

            [].forEach.call(document.getElementsByClassName("obs-scene-control"), function(s) {
                s.classList.add("hidden");
            });

            document.getElementById(scene.control).classList.remove("hidden");
        };

        document.getElementById("intro").onclick = function() {
            Control.ws.send(JSON.stringify({
                type: "scene",
                state: "intro"
            }));
        };

        document.getElementById("brb").onclick = function() {
            Control.ws.send(JSON.stringify({
                type: "scene",
                state: "brb"
            }));
        };

        document.getElementById("thanks").onclick = function() {
            Control.ws.send(JSON.stringify({
                type: "scene",
                state: "thanks"
            }));
        };

        document.getElementById("full-screen").onclick = function() {
            Control.ws.send(JSON.stringify({
                type: "scene",
                state: "fullscreen"
            }));
        };

        document.getElementById("switch-scene").onclick = function() {
            var sceneList = document.getElementById("scene-list");

            Control.ws.send(JSON.stringify({
                type: "scene",
                state: "scene",
                scene: sceneList.options[sceneList.selectedIndex].value
            }));
        };

        document.getElementById("dcl").onclick = function() {
            Control.ws.send(JSON.stringify({
                type: "action",
                action: "dcl"
            }));
        };

        document.getElementById("fire").onclick = function() {
            Control.ws.send(JSON.stringify({
                type: "action",
                action: "fire"
            }));
        };

        document.getElementById("time").onclick = function() {
            Control.ws.send(JSON.stringify({
                type: "action",
                action: "time"
            }));
        };

        document.getElementById("channel-select").onclick = function() {
            var channelList = document.getElementById("channel-list");

            Control.ws.send(JSON.stringify({
                type: "channel",
                channel: channelList.options[channelList.selectedIndex].value
            }));
        };

        document.getElementById("play-playlist").onclick = function() {
            var musicList = document.getElementById("music-list"),
                x = new XMLHttpRequest();

            x.timeout = 5000;
            x.open("POST", "api/spotifyPlay", true);
            x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            x.send("playlist=" + musicList.options[musicList.selectedIndex].value);
        };

        document.getElementById("stop").onclick = function() {
            var x = new XMLHttpRequest();

            x.timeout = 5000;
            x.open("POST", "api/spotifyPause", true);
            x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            x.send();
        };

        document.getElementById("nd-player-1").onblur = function() {
            Control.ws.send(JSON.stringify({
                type: "nd",
                action: "player",
                side: "left",
                name: document.getElementById("nd-player-1").value
            }));
        };

        document.getElementById("nd-player-2").onblur = function() {
            Control.ws.send(JSON.stringify({
                type: "nd",
                action: "player",
                side: "right",
                name: document.getElementById("nd-player-2").value
            }));
        };

        document.getElementById("nd-lute-left1").onclick = function() {
            Control.ws.send(JSON.stringify({
                type: "nd",
                action: "lute",
                side: "left",
                number: 1
            }));
        };

        document.getElementById("nd-lute-left2").onclick = function() {
            Control.ws.send(JSON.stringify({
                type: "nd",
                action: "lute",
                side: "left",
                number: 2
            }));
        };

        document.getElementById("nd-lute-left3").onclick = function() {
            Control.ws.send(JSON.stringify({
                type: "nd",
                action: "lute",
                side: "left",
                number: 3
            }));
        };

        document.getElementById("nd-lute-right1").onclick = function() {
            Control.ws.send(JSON.stringify({
                type: "nd",
                action: "lute",
                side: "right",
                number: 1
            }));
        };

        document.getElementById("nd-lute-right2").onclick = function() {
            Control.ws.send(JSON.stringify({
                type: "nd",
                action: "lute",
                side: "right",
                number: 2
            }));
        };

        document.getElementById("nd-lute-right3").onclick = function() {
            Control.ws.send(JSON.stringify({
                type: "nd",
                action: "lute",
                side: "right",
                number: 3
            }));
        };

        document.getElementById("nd-scene-countdown-ndc7").onclick = function() {
            Control.ws.send(JSON.stringify({
                type: "scene",
                scene: "nd-countdown",
                stats: "ndc7",
                event: Control.event,
                time: document.getElementById("nd-start-time").value,
                finish: document.getElementById("nd-finish-text").value
            }));
        };

        document.getElementById("nd-scene-race").onclick = function() {
            var layoutList = document.getElementById("nd-layout-list");

            Control.ws.send(JSON.stringify({
                type: "scene",
                scene: "nd-race",
                layout: layoutList.options[layoutList.selectedIndex].value
            }));
        };

        document.getElementById("nd-scene-thanks-ndc7").onclick = function() {
            Control.ws.send(JSON.stringify({
                type: "scene",
                scene: "nd-thanks",
                stats: "ndc7",
                event: Control.event
            }));
        };

        Control.loadSchedule();

        document.getElementById("nd-schedule-select").onclick = function() {
            var scheduleList = document.getElementById("nd-schedule-list"),
                data = JSON.parse(scheduleList.options[scheduleList.selectedIndex].value),
                date = new Date(data.date);

            document.getElementById("nd-player-1").value = data.player1;
            document.getElementById("nd-player-2").value = data.player2;
            document.getElementById("nd-start-time").value = ((date.getHours() + 11) % 12 + 1).toString() + ":" + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes().toString() + " " + (date.getHours() < 12 ? "AM" : "PM");

            Control.ws.send(JSON.stringify({
                type: "nd",
                action: "player",
                side: "left",
                name: document.getElementById("nd-player-1").value
            }));

            Control.ws.send(JSON.stringify({
                type: "nd",
                action: "player",
                side: "right",
                name: document.getElementById("nd-player-2").value
            }));

            Control.ws.send(JSON.stringify({
                type: "nd",
                action: "start-time",
                time: document.getElementById("nd-start-time").value
            }));
        };

        document.getElementById("nd-change-layout").onclick = function() {
            var layoutList = document.getElementById("nd-layout-list");

            Control.ws.send(JSON.stringify({
                type: "nd",
                action: "layout",
                layout: layoutList.options[layoutList.selectedIndex].value
            }));
        };

        document.getElementById("nd-open-streams").onclick = function() {
            window.open("http://localhost:60577/ndracetwitch.htm?player1=" + document.getElementById("nd-player-1").value + "&player2=" + document.getElementById("nd-player-2").value);
        };

        document.getElementById("nd-start-time").onblur = function() {
            Control.ws.send(JSON.stringify({
                type: "nd",
                action: "start-time",
                time: document.getElementById("nd-start-time").value
            }));
        };

        document.getElementById("nd-finish-text").onblur = function() {
            Control.ws.send(JSON.stringify({
                type: "nd",
                action: "finish-text",
                finish: document.getElementById("nd-finish-text").value
            }));
        };

        document.getElementById("nd-timer-start").onclick = function() {
            Control.ws.send(JSON.stringify({
                type: "nd",
                action: "timer-start"
            }));
        };

        document.getElementById("nd-timer-stop").onclick = function() {
            Control.ws.send(JSON.stringify({
                type: "nd",
                action: "timer-stop"
            }));
        };

        document.getElementById("nd-timer-reset").onclick = function() {
            Control.ws.send(JSON.stringify({
                type: "nd",
                action: "timer-reset"
            }));
        };
    }
}

document.addEventListener("DOMContentLoaded", Control.DOMContentLoaded);
