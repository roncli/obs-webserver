//   ###                         ##
//  #   #                         #
//  #   #  #   #   ###   # ##     #     ###   #   #
//  #   #  #   #  #   #  ##  #    #        #  #   #
//  #   #   # #   #####  #        #     ####  #  ##
//  #   #   # #   #      #        #    #   #   ## #
//   ###     #     ###   #       ###    ####      #
//                                            #   #
//                                             ###
/**
 * A class that provides functions for the overlay page.
 */
class Overlay {
    // ###    ##   #  #   ##                #                 #    #                    #           #
    // #  #  #  #  ####  #  #               #                 #    #                    #           #
    // #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
    // #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
    // #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
    // ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
    /**
     * Sets up the page's events.
     * @returns {void}
     */
    static DOMContentLoaded() {
        Overlay.startWebsocket();

        document.getElementById("video-stinger").addEventListener("playing", () => {
            setTimeout(() => {
                const stinger = document.getElementById("stinger");

                stinger.classList.remove("hidden");
                stinger.classList.add("stinger");

                setTimeout(() => {
                    stinger.classList.remove("stinger");
                    stinger.classList.add("hidden");
                }, 2000);
            }, 100);
        });
    }

    //         #                 #    ####   #
    //         #                 #    #
    //  ###   ###    ###  ###   ###   ###   ##    ###    ##
    // ##      #    #  #  #  #   #    #      #    #  #  # ##
    //   ##    #    # ##  #      #    #      #    #     ##
    // ###      ##   # #  #       ##  #     ###   #      ##
    /**
     * Starts the fire GIF.
     * @returns {void}
     */
    static startFire() {
        const fire = document.getElementById("fire");

        fire.classList.add("fire");

        setTimeout(() => {
            fire.classList.remove("fire");
        }, 10000);
    }

    //         #                 #     ##    #     #
    //         #                 #    #  #   #
    //  ###   ###    ###  ###   ###    #    ###   ##    ###    ###   ##   ###
    // ##      #    #  #  #  #   #      #    #     #    #  #  #  #  # ##  #  #
    //   ##    #    # ##  #      #    #  #   #     #    #  #   ##   ##    #
    // ###      ##   # #  #       ##   ##     ##  ###   #  #  #      ##   #
    //                                                         ###
    /**
     * Starts the stinger transition.
     * @returns {Promise} A promise that resolves when the stinger has started.
     */
    static startStinger() {
        /** @type {HTMLVideoElement} */
        const stinger = document.getElementById("video-stinger");
        stinger.volume = 0.75;
        stinger.play();
    }

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
        /** @type {WebSocket} */
        Overlay.ws = new WebSocket("ws://" + document.location.hostname + ":" + (document.location.port || "80") + "/");

        Overlay.ws.onmessage = (ev) => {
            const data = JSON.parse(ev.data);

            switch (data.type) {
                case "reset":
                    window.location.reload();
                    break;
                case "overlay":
                    switch (data.data.type) {
                        case "fire":
                            Overlay.startFire();
                            break;
                        case "stinger":
                            Overlay.startStinger();
                            break;
                    }

                    if (data.data.soundPath) {
                        const sounds = document.getElementById("sounds"),
                            sound = document.createElement("audio");

                        sound.autoplay = true;
                        sound.src = data.data.soundPath;
                        sound.type = "audio/ogg";
                        sound.addEventListener("ended", () => {
                            sound.parentNode.removeChild(sound);
                        });
                        sounds.appendChild(sound);
                    }

                    break;
            }
        };
    }
}

document.addEventListener("DOMContentLoaded", Overlay.DOMContentLoaded);

window.Overlay = Overlay;
