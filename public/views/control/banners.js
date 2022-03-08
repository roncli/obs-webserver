/** @typedef {import("../../../types/viewTypes").Banner} ViewTypes.Banner */

//  ####                                             #   #    #
//   #  #                                            #   #
//   #  #   ###   # ##   # ##    ###   # ##    ###   #   #   ##     ###   #   #
//   ###       #  ##  #  ##  #  #   #  ##  #  #       # #     #    #   #  #   #
//   #  #   ####  #   #  #   #  #####  #       ###    # #     #    #####  # # #
//   #  #  #   #  #   #  #   #  #      #          #   # #     #    #      # # #
//  ####    ####  #   #  #   #   ###   #      ####     #     ###    ###    # #
/**
 * A class that represents the banners settings view.
 */
class BannersView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered banners settings template.
     * @param {{data: ViewTypes.Banner[]}} banners The banners to render.
     * @returns {string} An HTML string of the banners settings view.
     */
    static get(banners) {
        return /* html */`
            <div>
                Banners<br />
                ${banners.data.map((a) => BannersView.BannerView.get(a)).join("")}
                ${BannersView.BannerView.get({}, true)}
                <button class="settings-save" data-key="banners">Save</button>
                <button class="settings-cancel">Cancel</button>
            </div>
        `;
    }
}

/** @type {typeof import("./banner")} */
// @ts-ignore
BannersView.BannerView = typeof BannerView === "undefined" ? require("./banner") : BannerView; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.BannersView = BannersView;
} else {
    module.exports = BannersView; // eslint-disable-line no-undef
}
