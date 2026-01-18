/**
 * @typedef {import("../../../types/viewTypes").Banner} ViewTypes.Banner
 * @typedef {import("../../../types/viewTypes").RoncliGaming} ViewTypes.RoncliGaming
 */

// MARK: class RoncliGamingView
/**
 * A class that represents the roncli Gaming view.
 */
class RoncliGamingView {
    // MARK: static get
    /**
     * Gets the rendered roncli Gaming template.
     * @param {{data: ViewTypes.RoncliGaming}} data The data to render the view with.
     * @returns {string} An HTML string of the roncli Gaming view.
     */
    static get(data) {
        return /* html */`
            <div>
                roncli Gaming<br />
                <div>
                    <button class="transition" data-transition="Start Stream">Start Stream</button><br />
                    <button class="transition" data-transition="Start Analysis">Start Analysis</button><br />
                    <button class="transition" data-transition="Start Head to Head">Start Head to Head</button><br />
                    <button class="transition" data-transition="Start CTM">Start CTM</button>
                </div>
                <div>
                    <button class="transition" data-transition="Game">Game</button><br />
                    <button class="transition" data-transition="Analysis">Analysis</button><br />
                    <button class="transition" data-transition="Head to Head">Head to Head</button><br />
                    <button class="transition" data-transition="CTM">CTM</button>
                </div>
                <div>
                    <button class="transition" data-transition="Webcam">Webcam</button><br />
                    <button class="transition" data-transition="BRB">BRB</button>
                </div>
                <button class="transition" data-transition="End Stream">End Stream</button>
                <div class="api" data-api="/api/roncliGaming">
                    <div>
                        Title <textarea class="setting" data-type="title" style="width: 300px; height: 57px;">${RoncliGamingView.Common.htmlEncode(data.data.title).replace(/<br \/>/gi, "\r\n")}</textarea><br />
                        Game <input type="text" class="setting" data-type="game" style="width: 300px;" value="${RoncliGamingView.Common.htmlEncode(data.data.game)}"><br />
                        <button id="update-twitch">Update Twitch</button>
                    </div>
                    <div>
                        Info <textarea class="setting" data-type="info" style="width: 300px; height: 400px;">${RoncliGamingView.Common.htmlEncode(data.data.info).replace(/<br \/>/gi, "\r\n")}</textarea>
                    </div>
                    <div>
                        Analysis <textarea class="setting" data-type="analysis" style="width: 300px; height: 400px;">${RoncliGamingView.Common.htmlEncode(data.data.analysis).replace(/<br \/>/gi, "\r\n")}</textarea>
                    </div>
                    <div>
                        <div>
                            Player 1<br />
                            Name <input type="text" class="setting" id="player1" data-type="player1" style="width: 300px;" value="${RoncliGamingView.Common.htmlEncode(data.data.player1)}"><br />
                            Twitch <input type="text" class="setting" id="twitch1" data-type="twitch1" style="width: 300px;" value="${RoncliGamingView.Common.htmlEncode(data.data.twitch1)}"><br />
                            Score <input type="text" class="setting" data-type="score1" style="width: 300px;" value="${RoncliGamingView.Common.htmlEncode(data.data.score1)}"><br />
                            <button id="player1-start">Start Player 1</button>
                            <button id="player1-start-replay">Start Player 1 Replay</button>
                            <button id="player1-toggle-replay">Toggle Player 1 Replay</button>
                        </div>
                        <div>
                            Player 2<br />
                            Name <input type="text" class="setting" id="player2" data-type="player2" style="width: 300px;" value="${RoncliGamingView.Common.htmlEncode(data.data.player2)}"><br />
                            Twitch <input type="text" class="setting" id="twitch2" data-type="twitch2" style="width: 300px;" value="${RoncliGamingView.Common.htmlEncode(data.data.twitch2)}"><br />
                            Score <input type="text" class="setting" data-type="score2" style="width: 300px;" value="${RoncliGamingView.Common.htmlEncode(data.data.score2)}"><br />
                            <button id="player2-start">Start Player 2</button>
                            <button id="player2-start-replay">Start Player 2 Replay</button>
                            <button id="player2-toggle-replay">Toggle Player 2 Replay</button>
                        </div>
                        <div>
                            <button id="timer-reset">Reset Timer</button>
                            <button id="timer-start">Start Timer</button>
                            <button id="timer-stop">Stop Timer</button><br />
                            Score Units <input type="text" class="setting" data-type="units" style="width: 300px;" value="${RoncliGamingView.Common.htmlEncode(data.data.units)}"><br />
                            Banner <select id="banner-list">
                                ${data.data.banners ? data.data.banners.map((b) => /* html */`
                                    <option class="banner" data-url="${b.url}">${RoncliGamingView.Common.htmlEncode(b.title)}</option>
                                `).join("") : ""}
                            </select> <button id="banner-go">Go</button> <button class="setting" data-settings="Banners" data-path="/js/?files=/views/control/banner.js,/views/control/banners.js" data-class="BannersView" data-subclass="BannerView" data-api="/api/banners">Banners</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

/** @type {typeof import("../../../web/includes/common")} */
// @ts-ignore
RoncliGamingView.Common = typeof Common === "undefined" ? require("../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.RoncliGamingView = RoncliGamingView;
} else {
    module.exports = RoncliGamingView; // eslint-disable-line no-undef
}
