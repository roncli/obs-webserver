//   ###                        ####                                #     #   #    #
//  #   #                       #   #                               #     #   #
//  #       ###   ## #    ###   #   #   ###    ###    ###   # ##   ####   #   #   ##     ###   #   #
//  #          #  # # #  #   #  ####   #   #  #   #  #   #  ##  #   #      # #     #    #   #  #   #
//  #  ##   ####  # # #  #####  # #    #####  #      #####  #   #   #      # #     #    #####  # # #
//  #   #  #   #  # # #  #      #  #   #      #   #  #      #   #   #  #   # #     #    #      # # #
//   ###    ####  #   #   ###   #   #   ###    ###    ###   #   #    ##     #     ###    ###    # #
/**
 * A class that represents the game recent view.
 */
class GameRecentView {
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
        if (!GameRecentView.Home || !GameRecentView.Home.data) {
            return "";
        }

        const data = GameRecentView.Home.data;

        if (!data.recent || !data.recent.length) {
            return "";
        }

        return /* html */`
            <div class="recent">
                ${data.recent.map((html) => /* html */`
                    <div>${html}</div>
                `).reverse().slice(0, 4).join("")}
            </div>
        `;
    }
}

// @ts-ignore
GameRecentView.Home = typeof Home === "undefined" ? void 0 : Home; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.GameRecentView = GameRecentView;
} else {
    module.exports = GameRecentView; // eslint-disable-line no-undef
}
