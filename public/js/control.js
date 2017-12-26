/* eslint-env es6:false */
/* global Spotify */

//   ###                   ##     #
//  #   #                 #  #
//  #       ###   # ##    #      ##     ## #
//  #      #   #  ##  #  ####     #    #  #
//  #      #   #  #   #   #       #     ##
//  #   #  #   #  #   #   #       #    #
//   ###    ###   #   #   #      ###    ###
//                                     #   #
//                                      ###
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
        Control.ws = new WebSocket(`ws://${document.location.hostname}:${document.location.port || "80"}/ws/update`);

        Control.ws.onmessage = function(ev) {
            var data = JSON.parse(ev.data),
                sceneList = document.getElementById("scene-list");

            switch (data.type) {
                case "scenes":
                    Control.scenes = data.data.scenes;

                    Control.scenes.forEach(function(scene) {
                        var option = document.createElement("option");

                        option.value = scene.name;
                        option.text = scene.name;

                        sceneList.appendChild(option);
                    });
                    break;
            }
        };
    }
}

// ###    ##   #  #   ##                #                 #    #                    #           #
// #  #  #  #  ####  #  #               #                 #    #                    #           #
// #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
// #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
// #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
// ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
document.addEventListener("DOMContentLoaded", function() {
    Control.startWebsocket();

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

    document.getElementById("dcl").onclick = function() {
        Control.ws.send(JSON.stringify({
            type: "scene",
            state: "dcl"
        }));
    };

    document.getElementById("switch-scene").onclick = function() {
        var sceneList = document.getElementById("scene-list"),
            sceneName = sceneList.options[sceneList.selectedIndex].value;

        Control.ws.send(JSON.stringify({
            type: "scene",
            state: "scene",
            scene: Control.scenes.find(function(s) {
                return s.name === sceneName;
            })
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

    document.getElementById("stop").onclick = function() {
        Spotify.pause();
    };

    document.getElementById("roncli-gaming").onclick = function() {
        Spotify.playPlaylist("spotify:user:1211227601:playlist:6vC594uhppzSoqqmxhXy0A");
    };
});
