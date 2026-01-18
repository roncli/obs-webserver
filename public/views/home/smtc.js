// MARK: class SMTCView
/**
 * A class that represents the SMTC view.
 */
class SMTCView {
    // MARK: static get
    /**
     * Gets the rendered page template.
     * @returns {string} An HTML string of the page.
     */
    static get() {
        if (!SMTCView.Home || !SMTCView.Home.smtcTrack || !SMTCView.Home.smtcTrack.playing) {
            return "";
        }

        return /* html */`
            <div class="now-playing">
                Now Playing<br />
                <span class="text">
                    ${SMTCView.Common.htmlEncode(SMTCView.Home.smtcTrack.artist)}<br />
                    ${SMTCView.Common.htmlEncode(SMTCView.Home.smtcTrack.title)}
                </span>
            </div>
            ${SMTCView.Home.smtcTrack.imageUrl ? /* html */`
                <div class="artwork">
                    <img src="${SMTCView.Home.smtcTrack.imageUrl}" />
                </div>
            ` : ""}
        `;
    }
}

/** @type {typeof import("../../../web/includes/common")} */
// @ts-ignore
SMTCView.Common = typeof Common === "undefined" ? require("../../web/includes/common") : Common; // eslint-disable-line no-undef
// @ts-ignore
SMTCView.Home = typeof Home === "undefined" ? void 0 : Home; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.SMTCView = SMTCView;
} else {
    module.exports = SMTCView; // eslint-disable-line no-undef
}
