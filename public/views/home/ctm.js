/**
 * @typedef {import("../../../types/viewTypes").RoncliGaming} ViewTypes.RoncliGaming
 */

// MARK: class CTMView
/**
 * A class that represents the game view.
 */
class CTMView {
    // MARK: static get
    /**
     * Gets the rendered page template.
     * @param {{data: ViewTypes.RoncliGaming}} data The data to render.
     * @returns {string} An HTML string of the page.
     */
    static get(data) {
        return /* html */`
            <div id="ctm">
                <div id="spotify">${CTMView.SpotifyView.get()}</div>
                <div id="title">${CTMView.GameTitleView.get(data.data.title)}</div>
                <div id="info">${CTMView.GameInfoView.get(data.data.info)}</div>
                <div id="notification"></div>
                <div id="elapsed"></div>
            </div>
        `;
    }
}

/** @type {typeof import("./game/info")} */
// @ts-ignore
CTMView.GameInfoView = typeof GameInfoView === "undefined" ? require("./game/info") : GameInfoView; // eslint-disable-line no-undef
/** @type {typeof import("./spotify")} */
// @ts-ignore
CTMView.SpotifyView = typeof SpotifyView === "undefined" ? require("./game/spotify") : SpotifyView; // eslint-disable-line no-undef
/** @type {typeof import("./game/title")} */
// @ts-ignore
CTMView.GameTitleView = typeof GameTitleView === "undefined" ? require("./game/title") : GameTitleView; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.CTMView = CTMView;
} else {
    module.exports = CTMView; // eslint-disable-line no-undef
}
