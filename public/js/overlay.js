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

    //        ##
    //         #
    //  ###    #     ##    ##   ###
    // ##      #    # ##  # ##  #  #
    //   ##    #    ##    ##    #  #
    // ###    ###    ##    ##   ###
    //                          #
    /**
     * Sleeps for a specified amount of time.
     * @param {number} ms The number of milliseconds to sleep.
     * @returns {Promise} A promise that resolves when the function is done sleeping.
     */
    static sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
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
     * @returns {void}
     */
    static startStinger() {
        /** @type {HTMLVideoElement} */
        const stinger = document.getElementById("video-stinger");
        stinger.volume = 0.75;
        stinger.play();
    }

    //         #                 #    ###                            #
    //         #                 #     #                             #
    //  ###   ###    ###  ###   ###    #     ##   ###    ##   #  #  ###
    // ##      #    #  #  #  #   #     #    #  #  #  #  #  #  #  #   #
    //   ##    #    # ##  #      #     #    #  #  #  #  #  #  #  #   #
    // ###      ##   # #  #       ##   #     ##   ###    ##    ###    ##
    //                                            #
    /**
     * Starts the topout transition.
     * @returns {Promise} A promise that resolves when the topout is complete.
     */
    static async startTopout() {
        /** @type {HTMLAudioElement} */
        const topout = document.getElementById("audio-topout"),
            el = document.getElementById("topout");

        topout.play();

        el.classList.remove("hidden");
        el.classList.add("stinger");

        setTimeout(() => {
            el.classList.add("hidden");
            el.classList.remove("stinger");
        }, 2000);

        for (let i = 0; i < 1112; i += 32) {
            el.style.height = `${i}px`;
            await Overlay.sleep(20);
        }
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
                        case "topout":
                            Overlay.startTopout();
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
