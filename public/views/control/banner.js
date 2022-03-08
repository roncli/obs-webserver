/** @typedef {import("../../../types/viewTypes").Banner} ViewTypes.Banner */

//  ####                                      #   #    #
//   #  #                                     #   #
//   #  #   ###   # ##   # ##    ###   # ##   #   #   ##     ###   #   #
//   ###       #  ##  #  ##  #  #   #  ##  #   # #     #    #   #  #   #
//   #  #   ####  #   #  #   #  #####  #       # #     #    #####  # # #
//   #  #  #   #  #   #  #   #  #      #       # #     #    #      # # #
//  ####    ####  #   #  #   #   ###   #        #     ###    ###    # #
/**
 * A class that represents the banner settings view.
 */
class BannerView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered banner setting template.
     * @param {ViewTypes.Banner} banner The banner to render.
     * @param {boolean} [add] Whether this is a new row to add or an existing row to remove.
     * @returns {string} An HTML string of the banner settings view.
     */
    static get(banner, add) {
        return /* html */`
            <div class="settings-row${add ? " settings-new" : ""}">
                ${add ? "" : /* html */`
                    <span draggable="true" class="draggable emoji">↕</span>
                `}
                URL: <input type="text" data-field="url" style="width: 500px;" value="${BannerView.Common.htmlEncode(banner.url)}" />
                Title: <input type="text" data-field="title" value="${BannerView.Common.htmlEncode(banner.title)}" />
                <button class="emoji ${add ? "add" : "remove"}">${add ? "➕" : "❌"}</button>
            </div>
        `;
    }
}

/** @type {typeof import("../../../web/includes/common")} */
// @ts-ignore
BannerView.Common = typeof Common === "undefined" ? require("../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.BannerView = BannerView;
} else {
    module.exports = BannerView; // eslint-disable-line no-undef
}
