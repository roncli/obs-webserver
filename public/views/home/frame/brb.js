//  #####                              ####   ####   ####   #   #    #
//  #                                   #  #  #   #   #  #  #   #
//  #      # ##    ###   ## #    ###    #  #  #   #   #  #  #   #   ##     ###   #   #
//  ####   ##  #      #  # # #  #   #   ###   ####    ###    # #     #    #   #  #   #
//  #      #       ####  # # #  #####   #  #  # #     #  #   # #     #    #####  # # #
//  #      #      #   #  # # #  #       #  #  #  #    #  #   # #     #    #      # # #
//  #      #       ####  #   #   ###   ####   #   #  ####     #     ###    ###    # #
/**
 * A class that represents the frame trailer view.
 */
class FrameBRBView {
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
            <div id="roncli-gaming-small"></div>
            <div id="whatever"></div>
            <div id="brb-text">Will Resume Shortly!</div>
            <div id="spotify">${FrameBRBView.SpotifyView.get()}</div>
            <div id="social">
                <div>
                    <div id="discord-icon"></div>
                    <div id="discord">https://ronc.li/discord</div>
                    <div id="twitter-icon"></div>
                    <div id="twitter">https://twitter.com/roncli</div>
                </div>
            </div>
        `;
    }
}

/** @type {typeof import("../spotify")} */
// @ts-ignore
FrameBRBView.SpotifyView = typeof SpotifyView === "undefined" ? require("./game/spotify") : this.SpotifyView; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.FrameBRBView = FrameBRBView;
} else {
    module.exports = FrameBRBView; // eslint-disable-line no-undef
}
