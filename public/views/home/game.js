/**
 * @typedef {import("../../../types/viewTypes").RoncliGaming} ViewTypes.RoncliGaming
 */

// MARK: static GameView
/**
 * A class that represents the game view.
 */
class GameView {
    // MARK: static get
    /**
     * Gets the rendered page template.
     * @param {{data: ViewTypes.RoncliGaming}} data The data to render.
     * @returns {string} An HTML string of the page.
     */
    static get(data) {
        return /* html */`
            <div id="game">
                <div id="smtc">${GameView.SMTCView.get()}</div>
                <div id="title">${GameView.GameTitleView.get(data.data.title)}</div>
                <div id="info">${GameView.GameInfoView.get(data.data.info)}</div>
                <div id="support">${GameView.GameSupportView.get()}</div>
                <div id="recent">${GameView.GameRecentView.get()}</div>
                <div id="notification"></div>
                <div id="elapsed"></div>
                <div id="social">
                    <div>
                        <div id="discord-icon"></div>
                        <div id="discord">https://ronc.li/discord</div>
                        <div id="twitter-icon"></div>
                        <div id="twitter">https://twitter.com/roncli</div>
                    </div>
                </div>
            </div>
        `;
    }
}

/** @type {typeof import("./game/info")} */
// @ts-ignore
GameView.GameInfoView = typeof GameInfoView === "undefined" ? require("./game/info") : GameInfoView; // eslint-disable-line no-undef
/** @type {typeof import("./game/recent")} */
// @ts-ignore
GameView.GameRecentView = typeof GameRecentView === "undefined" ? require("./game/recent") : GameRecentView; // eslint-disable-line no-undef
/** @type {typeof import("./smtc")} */
// @ts-ignore
GameView.SMTCView = typeof SMTCView === "undefined" ? require("./smtc") : SMTCView; // eslint-disable-line no-undef
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
