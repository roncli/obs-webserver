// MARK: class FrameEndingView
/**
 * A class that represents the frame ending view.
 */
class FrameEndingView {
    // MARK: static get
    /**
     * Gets the rendered page template.
     * @param {string} version The version.
     * @returns {string} An HTML string of the page.
     */
    static get(version) {
        const data = FrameEndingView.Home && FrameEndingView.Home.data || {};

        let followers = [];
        if (data.follow) {
            followers = Object.keys(data.follow).map((f) => data.follow[f].name).sort();
        }

        let raids = [];
        if (data.raided) {
            raids = Object.keys(data.raided).map((r) => data.raided[r].name).sort();
        }

        let cheers = [];
        if (data.bits) {
            cheers = Object.keys(data.bits).map((b) => data.bits[b].name).sort();
        }

        let donations = [];
        if (data.donation) {
            donations = Object.keys(data.donation).sort();
        }

        let subs = [];
        if (data.sub) {
            subs = Object.keys(data.sub).map((s) => data.sub[s].name).sort();
        }

        let primeGifts = [];
        if (data.giftPrime) {
            primeGifts = Object.keys(data.giftPrime).map((g) => data.giftPrime[g].name).sort();
        }

        let giftSubs = [];
        if (data.subGift) {
            giftSubs = Object.keys(data.subGift).map((s) => data.subGift[s].name).sort();
        }

        return /* html */`
            <div id="crawler">
                ${followers.length + raids.length + cheers.length + donations.length + subs.length === 0 ? /* html */`
                    Thanks to everyone for watching!
                ` : /* html */`
                    Thanks to everyone for watching, and an extra thanks to those who supported the stream today!
                    ${followers.length === 0 ? "" : /* html */`
                        <br /><br />New Followers:<br />${followers.map((f) => /* html */`<span class="text">${FrameEndingView.Common.htmlEncode(f)}</span>`).join("<br />")}
                    `}
                    ${raids.length === 0 ? "" : /* html */`
                        <br /><br />Raids:<br />${raids.map((r) => /* html */`<span class="text">${FrameEndingView.Common.htmlEncode(r)}</span>`).join("<br />")}
                    `}
                    ${cheers.length === 0 ? "" : /* html */`
                        <br /><br />Cheers:<br />${cheers.map((c) => /* html */`<span class="text">${FrameEndingView.Common.htmlEncode(c)}</span>`).join("<br />")}
                    `}
                    ${donations.length === 0 ? "" : /* html */`
                        <br /><br />Donations:<br />${donations.map((d) => /* html */`<span class="text">${FrameEndingView.Common.htmlEncode(d)}</span>`).join("<br />")}
                    `}
                    ${subs.length === 0 ? "" : /* html */`
                        <br /><br />Subscriptions:<br />${subs.map((s) => /* html */`<span class="text">${FrameEndingView.Common.htmlEncode(s)}</span>`).join("<br />")}
                    `}
                `}
                ${primeGifts.length + giftSubs.length === 0 ? "" : /* html */`
                    <br /><br />Much love and appreciation to those supporting the Boom Team!
                    ${giftSubs.length === 0 ? "" : /* html */`
                        <br /><br />Gift Subscriptions From:<br />${giftSubs.map((g) => /* html */`<span class="text">${FrameEndingView.Common.htmlEncode(g)}</span>`).join("<br />")}
                    `}
                    ${primeGifts.length === 0 ? "" : /* html */`
                        <br /><br />Prime Gifts From:<br />${primeGifts.map((p) => /* html */`<span class="text">${FrameEndingView.Common.htmlEncode(p)}</span>`).join("<br />")}
                    `}
                `}
                ${data.achievements.length === 0 ? "" : /* html */`
                    <br /><br /><br /><br />roncli earned the following achievements from chat this stream:<br />${data.achievements.map((a) => /* html */`<span class="text">${FrameEndingView.Common.htmlEncode(a.message)}</span> (from ${FrameEndingView.Common.htmlEncode(a.from)})`).join("<br />")}
                `}<br /><br /><br /><br />
                Stream powered by https://github.com/roncli/obs-webserver version ${version}<br /><br /><br /><br />
                Special thanks:<br /><br />
                Gromfalloon for the awesome Noita-themed emotes!<br /><br />
                Solitha for continuing to let me do this, and for not killing me on stream!<br /><br /><br /><br />
                See you next time!
            </div>
            <div id="roncli-gaming-tiny"></div>
            <div id="rip"></div>
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

// @ts-ignore
FrameEndingView.Home = typeof Home === "undefined" ? void 0 : Home; // eslint-disable-line no-undef
/** @type {typeof import("../../../../web/includes/common")} */
// @ts-ignore
FrameEndingView.Common = typeof Common === "undefined" ? require("../../../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.FrameEndingView = FrameEndingView;
} else {
    module.exports = FrameEndingView; // eslint-disable-line no-undef
}
