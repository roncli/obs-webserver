//   ###           #
//    #            #
//    #    # ##   ####   # ##    ###
//    #    ##  #   #     ##  #  #   #
//    #    #   #   #     #      #   #
//    #    #   #   #  #  #      #   #
//   ###   #   #    ##   #       ###
/**
 * A class that provides functions for the intro scene.
 */
class Intro {
    //         #                 #
    //         #                 #
    //  ###   ###    ###  ###   ###
    // ##      #    #  #  #  #   #
    //   ##    #    # ##  #      #
    // ###      ##   # #  #       ##
    /**
     * Starts the intro scene.
     * @returns {void}
     */
    static start() {
        /** @type {HTMLVideoElement} */
        const videoIntro = document.getElementById("video-intro");

        videoIntro.play();
    }
}

window.Intro = Intro;
