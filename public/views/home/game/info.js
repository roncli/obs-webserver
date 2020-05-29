//   ###                         ###            ##          #   #    #
//  #   #                         #            #  #         #   #
//  #       ###   ## #    ###     #    # ##    #      ###   #   #   ##     ###   #   #
//  #          #  # # #  #   #    #    ##  #  ####   #   #   # #     #    #   #  #   #
//  #  ##   ####  # # #  #####    #    #   #   #     #   #   # #     #    #####  # # #
//  #   #  #   #  # # #  #        #    #   #   #     #   #   # #     #    #      # # #
//   ###    ####  #   #   ###    ###   #   #   #      ###     #     ###    ###    # #
/**
 * A class that represents the game info view.
 */
class GameInfoView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered page template.
     * @param {string} info The data to render.
     * @returns {string} An HTML string of the page.
     */
    static get(info) {
        const infoArray = info.split("\n\n");

        let ret = "";

        infoArray.forEach((text) => {
            if (text.charAt(0) !== "-") {
                const textArray = text.split("\n");

                textArray.forEach((line, index) => {
                    ret = /* html */`${ret}
                        ${index === 0 ? /* html */`
                            <div class="header">${GameInfoView.Common.htmlEncode(line || "")}</div>
                        ` : /* html */`
                            <div class="text">${GameInfoView.Common.htmlEncode(line || "")}</div>
                        `}
                    `;
                });

                ret = /* html */`${ret}<br />`;
            }
        });

        return ret;
    }
}

/** @type {typeof import("../../../../web/includes/common")} */
// @ts-ignore
GameInfoView.Common = typeof Common === "undefined" ? require("../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.GameInfoView = GameInfoView;
} else {
    module.exports = GameInfoView; // eslint-disable-line no-undef
}
