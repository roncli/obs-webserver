// MARK: class Tetris2PView
/**
 * A class that represents the tetris 2P view.
 */
class Tetris2PView {
    // MARK: static get
    /**
     * Gets the rendered page template.
     * @param {{event: {organization: string, title: string, status: string, color: string}, player1: {name: string, score: string, info: string}, player2: {name: string, score: string, info: string}}} data The data for the view.
     * @returns {string} An HTML string of the page.
     */
    static get(data) {
        return /* html */`
            <div id="tetris2p">
                <div id="left-player">${Tetris2PView.Common.htmlEncode(data && data.player1 && data.player1.name)}</div>
                <div id="right-player">${Tetris2PView.Common.htmlEncode(data && data.player2 && data.player2.name)}</div>
                <div id="left-score">${Tetris2PView.Common.htmlEncode(data && data.player1 && data.player1.score)}</div>
                <div id="right-score">${Tetris2PView.Common.htmlEncode(data && data.player2 && data.player2.score)}</div>
                <div id="left-text">${Tetris2PView.Common.htmlEncode(data && data.player1 && data.player1.info).replace(/\r\n/g, "\r").replace(/[\r\n]/g, "<br />")}</div>
                <div id="right-text">${Tetris2PView.Common.htmlEncode(data && data.player2 && data.player2.info).replace(/\r\n/g, "\r").replace(/[\r\n]/g, "<br />")}</div>
                <div id="organization"${data && data.event && data.event.color ? ` style="color: ${data.event.color};"` : ""}>${Tetris2PView.Common.htmlEncode(data && data.event && data.event.organization)}</div>
                <div id="title"${data && data.event && data.event.color ? ` style="color: ${data.event.color};"` : ""}>${Tetris2PView.Common.htmlEncode(data && data.event && data.event.title)}</div>
                <div id="status"${data && data.event && data.event.color ? ` style="color: ${data.event.color};"` : ""}>${Tetris2PView.Common.htmlEncode(data && data.event && data.event.status)}</div>
            </div>
        `;
    }
}

/** @type {typeof import("../../../web/includes/common")} */
// @ts-ignore
Tetris2PView.Common = typeof Common === "undefined" ? require("../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.Tetris2PView = Tetris2PView;
} else {
    module.exports = Tetris2PView; // eslint-disable-line no-undef
}
