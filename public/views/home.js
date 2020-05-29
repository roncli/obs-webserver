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
     * @param {ViewTypes.HomeViewParameters} data The data to render the page with.
     * @returns {string} An HTML string of the page.
     */
    static get(data) {
        return /* html */`
            <div id="scene"></div>
            <div id="preload-media" class="hidden">
                <video>
                    <source src="/media/intro.mp4" type="video/mp4" />
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
