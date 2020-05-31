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
            <div id="trailer"></div>
        `;
    }
}

if (typeof module === "undefined") {
    window.FrameTrailerView = FrameTrailerView;
} else {
    module.exports = FrameTrailerView; // eslint-disable-line no-undef
}
