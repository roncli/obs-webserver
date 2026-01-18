// MARK: class TetrisView
/**
 * A class that represents the tetris view.
 */
class TetrisView {
    // MARK: static get
    /**
     * Gets the rendered page template.
     * @param {{organization: string, title: string, color: string}} data The data for the view.
     * @returns {string} An HTML string of the page.
     */
    static get(data) {
        return /* html */`
            <div id="tetris">
                <div id="tetris-game"></div>
                <div id="organization"${data && data.color ? ` style="color: ${data.color};"` : ""}>${TetrisView.Common.htmlEncode(data && data.organization)}</div>
                <div id="title"${data && data.color ? ` style="color: ${data.color};"` : ""}>${TetrisView.Common.htmlEncode(data && data.title)}</div>
            </div>
        `;
    }
}

/** @type {typeof import("../../../web/includes/common")} */
// @ts-ignore
TetrisView.Common = typeof Common === "undefined" ? require("../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.TetrisView = TetrisView;
} else {
    module.exports = TetrisView; // eslint-disable-line no-undef
}
