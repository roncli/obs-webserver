//  #####
//  #
//  #      # ##    ###   ## #    ###
//  ####   ##  #      #  # # #  #   #
//  #      #       ####  # # #  #####
//  #      #      #   #  # # #  #
//  #      #       ####  #   #   ###
/**
 * A class that provides functions for the frame scene.
 */
class Frame {
    //         #                 #
    //         #                 #
    //  ###   ###    ###  ###   ###
    // ##      #    #  #  #  #   #
    //   ##    #    # ##  #      #
    // ###      ##   # #  #       ##
    /**
     * Starts the frame scene.
     * @returns {void}
     */
    static async start() {
        window.handleMessage = (ev) => {
            if (document.getElementById("spotify")) {
                switch (ev.type) {
                    case "updateSpotify":
                        {
                            const lastTrack = ev.track ? JSON.stringify({
                                artist: ev.track.artist,
                                title: ev.track.title,
                                imageUrl: ev.track.imageUrl
                            }) : void 0;

                            if (lastTrack !== Frame.lastTrack) {
                                document.getElementById("spotify").innerHTML = window.SpotifyView.get(ev.track);
                            }

                            Frame.lastTrack = lastTrack;
                        }
                        break;
                }
            }
        };

        await Frame.startIntro();
    }

    //         #                 #    ###          #
    //         #                 #     #           #
    //  ###   ###    ###  ###   ###    #    ###   ###   ###    ##
    // ##      #    #  #  #  #   #     #    #  #   #    #  #  #  #
    //   ##    #    # ##  #      #     #    #  #   #    #     #  #
    // ###      ##   # #  #       ##  ###   #  #    ##  #      ##
    /**
     * Starts the intro frame.
     * @returns {Promise} A promise that resolves when the intro frame is shown.
     */
    static async startIntro() {
        await window.Common.loadTemplate("/js/?files=/views/home/frame/trailer.js", "FrameTrailerView");

        await window.Common.loadDataIntoTemplate(void 0, "#content", window.FrameTrailerView.get);
    }

    //         #                 #    ###   ###   ###
    //         #                 #    #  #  #  #  #  #
    //  ###   ###    ###  ###   ###   ###   #  #  ###
    // ##      #    #  #  #  #   #    #  #  ###   #  #
    //   ##    #    # ##  #      #    #  #  # #   #  #
    // ###      ##   # #  #       ##  ###   #  #  ###
    /**
     * Starts the BRB frame.
     * @returns {Promise} A promise that resolves when the BRB frame is shown.
     */
    static async startBRB() {
        await window.Common.loadTemplate("/js/?files=/views/home/frame/brb.js", "FrameBRBView");

        await window.Common.loadDataIntoTemplate(void 0, "#content", window.FrameBRBView.get);
    }

    //         #                 #    ####           #   #
    //         #                 #    #              #
    //  ###   ###    ###  ###   ###   ###   ###    ###  ##    ###    ###
    // ##      #    #  #  #  #   #    #     #  #  #  #   #    #  #  #  #
    //   ##    #    # ##  #      #    #     #  #  #  #   #    #  #   ##
    // ###      ##   # #  #       ##  ####  #  #   ###  ###   #  #  #
    //                                                               ###
    /**
     * Starts the ending frame.
     * @returns {Promise} A promise that resolves when the ending frame is shown.
     */
    static async startEnding() {
        await window.Common.loadTemplate("/js/?files=/views/home/frame/ending.js", "FrameEndingView");

        await window.Common.loadDataIntoTemplate(void 0, "#content", window.FrameEndingView.get);

        const height = Math.floor(document.getElementById("crawler").getBoundingClientRect().height);

        setTimeout(() => {
            document.getElementById("crawler").animate({
                top: ["486px", `${486 - height}px`],
                offset: [0, 1]
            }, {
                duration: Math.min(10000, 10000 * height / 972),
                fill: "forwards"
            });
        }, 5000);
    }
}

Frame.lastTrack = "";

window.Frame = Frame;
