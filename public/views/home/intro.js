//   ###           #                   #   #    #
//    #            #                   #   #
//    #    # ##   ####   # ##    ###   #   #   ##     ###   #   #
//    #    ##  #   #     ##  #  #   #   # #     #    #   #  #   #
//    #    #   #   #     #      #   #   # #     #    #####  # # #
//    #    #   #   #  #  #      #   #   # #     #    #      # # #
//   ###   #   #    ##   #       ###     #     ###    ###    # #
/**
 * A class that represents the intro view.
 */
class IntroView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered page template.
     * @returns {string} An HTML string of the page.
     */
    static get() {
        return /* html */`
            <div id="intro">
                <video autoplay="autoplay"  id="video-intro" width="1920" height="1080">
                    <source src="/media/intro.mp4" type="video/mp4" />
                </video>
            </div>
        `;
    }
}

if (typeof module === "undefined") {
    window.IntroView = IntroView;
} else {
    module.exports = IntroView; // eslint-disable-line no-undef
}
