//  #####                              #####                  #     ##                  #   #    #
//  #                                    #                           #                  #   #
//  #      # ##    ###   ## #    ###     #    # ##    ###    ##      #     ###   # ##   #   #   ##     ###   #   #
//  ####   ##  #      #  # # #  #   #    #    ##  #      #    #      #    #   #  ##  #   # #     #    #   #  #   #
//  #      #       ####  # # #  #####    #    #       ####    #      #    #####  #       # #     #    #####  # # #
//  #      #      #   #  # # #  #        #    #      #   #    #      #    #      #       # #     #    #      # # #
//  #      #       ####  #   #   ###     #    #       ####   ###    ###    ###   #        #     ###    ###    # #
/**
 * A class that represents the frame trailer view.
 */
class FrameTrailerView {
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
            <div id="roncli-gaming"></div>
            <div id="you-know-it"></div>
            <div id="trailer">
                <video id="video-trailer" preload="auto" width="1728" height="972">
                    <source src="/media/trailer.mp4" type="video/mp4" />
                </video>
            </div>
        `;
    }
}

if (typeof module === "undefined") {
    window.FrameTrailerView = FrameTrailerView;
} else {
    module.exports = FrameTrailerView; // eslint-disable-line no-undef
}
