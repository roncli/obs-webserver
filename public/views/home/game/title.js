//   ###                        #####    #     #      ##           #   #    #
//  #   #                         #            #       #           #   #
//  #       ###   ## #    ###     #     ##    ####     #     ###   #   #   ##     ###   #   #
//  #          #  # # #  #   #    #      #     #       #    #   #   # #     #    #   #  #   #
//  #  ##   ####  # # #  #####    #      #     #       #    #####   # #     #    #####  # # #
//  #   #  #   #  # # #  #        #      #     #  #    #    #       # #     #    #      # # #
//   ###    ####  #   #   ###     #     ###     ##    ###    ###     #     ###    ###    # #
/**
 * A class that represents the game title view.
 */
class GameTitleView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered page template.
     * @param {string} title The data to render.
     * @returns {string} An HTML string of the page.
     */
    static get(title) {
        const titleArray = title.split("\n");

        return /* html */`
            <div class="header">${GameTitleView.Common.htmlEncode(titleArray[0] || "")}</div>
            <div class="text">${GameTitleView.Common.htmlEncode(titleArray[1] || "")}</div>
        `;
    }
}

/** @type {typeof import("../../../../web/includes/common")} */
// @ts-ignore
GameTitleView.Common = typeof Common === "undefined" ? require("../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.GameTitleView = GameTitleView;
} else {
    module.exports = GameTitleView; // eslint-disable-line no-undef
}
