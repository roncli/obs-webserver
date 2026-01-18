/**
 * @typedef {import("../../../types/viewTypes").RoncliGaming} ViewTypes.RoncliGaming
 */

// MARK: class AnalysisView
/**
 * A class that represents the analysis view.
 */
class AnalysisView {
    // MARK: static get
    /**
     * Gets the rendered page template.
     * @param {{data: ViewTypes.RoncliGaming}} data The data to render.
     * @returns {string} An HTML string of the page.
     */
    static get(data) {
        return /* html */`
            <div id="analysis">
                <div id="smtc">${AnalysisView.SMTCView.get()}</div>
                <div id="title">${AnalysisView.GameTitleView.get(data.data.title)}</div>
                <div id="info">${AnalysisView.GameInfoView.get(data.data.info)}</div>
                <div id="analysis-info">${AnalysisView.GameInfoView.get(data.data.analysis)}</div>
                <div id="support">${AnalysisView.GameSupportView.get()}</div>
                <div id="recent">${AnalysisView.GameRecentView.get()}</div>
                <div id="notification"></div>
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
AnalysisView.GameInfoView = typeof GameInfoView === "undefined" ? require("./game/info") : GameInfoView; // eslint-disable-line no-undef
/** @type {typeof import("./game/recent")} */
// @ts-ignore
AnalysisView.GameRecentView = typeof GameRecentView === "undefined" ? require("./game/recent") : GameRecentView; // eslint-disable-line no-undef
/** @type {typeof import("./smtc")} */
// @ts-ignore
AnalysisView.SMTCView = typeof SMTCView === "undefined" ? require("./smtc") : SMTCView; // eslint-disable-line no-undef
/** @type {typeof import("./game/support")} */
// @ts-ignore
AnalysisView.GameSupportView = typeof GameSupportView === "undefined" ? require("./game/support") : GameSupportView; // eslint-disable-line no-undef
/** @type {typeof import("./game/title")} */
// @ts-ignore
AnalysisView.GameTitleView = typeof GameTitleView === "undefined" ? require("./game/title") : GameTitleView; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.AnalysisView = AnalysisView;
} else {
    module.exports = AnalysisView; // eslint-disable-line no-undef
}
