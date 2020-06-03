//   ###                         ##                  #   #    #
//  #   #                         #                  #   #
//  #   #  #   #   ###   # ##     #     ###   #   #  #   #   ##     ###   #   #
//  #   #  #   #  #   #  ##  #    #        #  #   #   # #     #    #   #  #   #
//  #   #   # #   #####  #        #     ####  #  ##   # #     #    #####  # # #
//  #   #   # #   #      #        #    #   #   ## #   # #     #    #      # # #
//   ###     #     ###   #       ###    ####      #    #     ###    ###    # #
//                                            #   #
//                                             ###
/**
 * A class that represents the overlay view.
 */
class OverlayView {
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
            <div id="scene">
                <div id="fire">
                    <img src="images/fire.gif" width="384" height="108" />                
                </div>
                <div id="stinger" class="hidden">
                    <video id="video-stinger" preload="auto" width="1920" height="1080">
                        <source src="/media/stinger.mp4" type="video/mp4" />
                    </video>
                </div>
                <div id="sounds"></div>
            </div>
        `;
    }
}

if (typeof module === "undefined") {
    window.OverlayView = OverlayView;
} else {
    module.exports = OverlayView; // eslint-disable-line no-undef
}
