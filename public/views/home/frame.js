//  #####                              #   #    #
//  #                                  #   #
//  #      # ##    ###   ## #    ###   #   #   ##     ###   #   #
//  ####   ##  #      #  # # #  #   #   # #     #    #   #  #   #
//  #      #       ####  # # #  #####   # #     #    #####  # # #
//  #      #      #   #  # # #  #       # #     #    #      # # #
//  #      #       ####  #   #   ###     #     ###    ###    # #
/**
 * A class that represents the frame view.
 */
class FrameView {
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
            <div id="frame">
                <div id="fire">
                    <video autoplay="autoplay" loop id="video-fire" width="1920" height="1080">
                        <source src="/media/fire.mp4" type="video/mp4" />
                    </video>
                </div>
                <div id="frame-image"></div>
                <div id="content"></div>
            </div>
        `;
    }
}

if (typeof module === "undefined") {
    window.FrameView = FrameView;
} else {
    module.exports = FrameView; // eslint-disable-line no-undef
}
