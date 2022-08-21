/**
 * @typedef {import("../../types/viewTypes").HomeViewParameters} ViewTypes.HomeViewParameters
 */

//  #   #                       #   #    #
//  #   #                       #   #
//  #   #   ###   ## #    ###   #   #   ##     ###   #   #
//  #####  #   #  # # #  #   #   # #     #    #   #  #   #
//  #   #  #   #  # # #  #####   # #     #    #####  # # #
//  #   #  #   #  # # #  #       # #     #    #      # # #
//  #   #   ###   #   #   ###     #     ###    ###    # #
/**
 * A class that represents the home view.
 */
class HomeView {
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
            <div id="scene"></div>
            <div id="preload-media" class="hidden">
                <video>
                    <source src="/media/intro.mp4" type="video/mp4" />
                    <source src="/media/trailer.mp4" type="video/mp4" />
                </video>
            </div>
        `;
    }
}

if (typeof module === "undefined") {
    window.HomeView = HomeView;
} else {
    module.exports = HomeView; // eslint-disable-line no-undef
}
