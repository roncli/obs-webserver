/** @typedef {import("../../../types/viewTypes").RoncliGaming} ViewTypes.RoncliGaming */

//   ###                        #   #    #
//  #   #                       #   #
//  #       ###   ## #    ###   #   #   ##     ###   #   #
//  #          #  # # #  #   #   # #     #    #   #  #   #
//  #  ##   ####  # # #  #####   # #     #    #####  # # #
//  #   #  #   #  # # #  #       # #     #    #      # # #
//   ###    ####  #   #   ###     #     ###    ###    # #
/**
 * A class that represents the game view.
 */
class GameView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered page template.
     * @param {{data: ViewTypes.RoncliGaming}} data The data to render.
     * @returns {string} An HTML string of the page.
     */
    static get(data) {
        return /* html */`
            <div id="game">
                <div id="spotify">${GameView.SpotifyView.get()}</div>
                <div id="title">${GameView.GameTitleView.get(data.data.title)}</div>
                <div id="info">${GameView.GameInfoView.get(data.data.info)}</div>
                <div id="support">${GameView.GameSupportView.get()}</div>
                <div id="recent">${GameView.GameRecentView.get()}</div>
                <div id="notification"></div>
            </div>
        `;
    }
}

/** @type {typeof import("./game/info")} */
// @ts-ignore
GameView.GameInfoView = typeof GameInfoView === "undefined" ? require("./game/info") : GameInfoView; // eslint-disable-line no-undef
/** @type {typeof import("./game/recent")} */
// @ts-ignore
GameView.GameRecentView = typeof GameRecentView === "undefined" ? require("./game/recent") : this.GameRecentView; // eslint-disable-line no-undef
/** @type {typeof import("./spotify")} */
// @ts-ignore
GameView.SpotifyView = typeof SpotifyView === "undefined" ? require("./game/spotify") : this.SpotifyView; // eslint-disable-line no-undef
/** @type {typeof import("./game/support")} */
// @ts-ignore
GameView.GameSupportView = typeof GameSupportView === "undefined" ? require("./game/support") : GameSupportView; // eslint-disable-line no-undef
/** @type {typeof import("./game/title")} */
// @ts-ignore
GameView.GameTitleView = typeof GameTitleView === "undefined" ? require("./game/title") : GameTitleView; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.GameView = GameView;
} else {
    module.exports = GameView; // eslint-disable-line no-undef
}
