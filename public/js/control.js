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
 * A class of static functions for the config page.
 */
class Config {
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
        Config.ws = new WebSocket(`ws://localhost:${document.location.port || "80"}/ws/update`);

        Config.ws.onmessage = (ev) => {
            const data = JSON.parse(ev.data),
                sceneList = document.getElementById("scene-list");

            switch (data.type) {
                case "scenes":
                    ({data: {scenes: Config.scenes}} = data);

                    Config.scenes.forEach((scene) => {
                        const option = document.createElement("option");
                        ({name: option.value, name: option.text} = scene);

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
document.addEventListener("DOMContentLoaded", () => {
    Config.startWebsocket();

    document.getElementById("intro").onclick = () => {
        Config.ws.send(JSON.stringify({
            type: "scene",
            state: "intro"
        }));
    };

    document.getElementById("brb").onclick = () => {
        Config.ws.send(JSON.stringify({
            type: "scene",
            state: "brb"
        }));
    };

    document.getElementById("thanks").onclick = () => {
        Config.ws.send(JSON.stringify({
            type: "scene",
            state: "thanks"
        }));
    };

    document.getElementById("full-screen").onclick = () => {
        Config.ws.send(JSON.stringify({
            type: "scene",
            state: "fullscreen"
        }));
    };

    document.getElementById("switch-scene").onclick = () => {
        const sceneList = document.getElementById("scene-list"),
            {options: {[sceneList.selectedIndex]: {value: sceneName}}} = sceneList;

        Config.ws.send(JSON.stringify({
            type: "scene",
            state: "scene",
            scene: Config.scenes.find((s) => s.name === sceneName)
        }));
    };

    document.getElementById("fire").onclick = () => {
        Config.ws.send(JSON.stringify({
            type: "action",
            action: "fire"
        }));
    };

    document.getElementById("time").onclick = () => {
        Config.ws.send(JSON.stringify({
            type: "action",
            action: "time"
        }));
    };

    document.getElementById("stop").onclick = () => {
        Spotify.pause();
    };

    document.getElementById("roncli-gaming").onclick = () => {
        Spotify.playPlaylist("spotify:user:1211227601:playlist:6vC594uhppzSoqqmxhXy0A");
    };

    document.getElementById("edm-radio").onclick = () => {
        Spotify.playPlaylist("spotify:station:user:1211227601:playlist:3r5jKhprymfYPPXfBmlHP5");
    };
});
