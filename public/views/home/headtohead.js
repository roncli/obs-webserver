/** @typedef {import("../../../types/viewTypes").RoncliGaming} ViewTypes.RoncliGaming */

//  #   #                    #  #####         #   #                    #  #   #    #
//  #   #                    #    #           #   #                    #  #   #
//  #   #   ###    ###    ## #    #     ###   #   #   ###    ###    ## #  #   #   ##     ###   #   #
//  #####  #   #      #  #  ##    #    #   #  #####  #   #      #  #  ##   # #     #    #   #  #   #
//  #   #  #####   ####  #   #    #    #   #  #   #  #####   ####  #   #   # #     #    #####  # # #
//  #   #  #      #   #  #  ##    #    #   #  #   #  #      #   #  #  ##   # #     #    #      # # #
//  #   #   ###    ####   ## #    #     ###   #   #   ###    ####   ## #    #     ###    ###    # #
/**
 * A class that represents the head to head view.
 */
class HeadToHeadView {
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
            <div id="head-to-head">
                <div id="spotify">${HeadToHeadView.SpotifyView.get()}</div>
                <div id="title">${HeadToHeadView.GameTitleView.get(data.data.title)}</div>
                <div id="support">${HeadToHeadView.GameSupportView.get()}</div>
                <div id="display-1"></div>
                <div id="player-1">${HeadToHeadView.Common.htmlEncode(data.data.player1)}</div>
                <div id="twitch-1">${HeadToHeadView.Common.htmlEncode(data.data.twitch1)}</div>
                <div id="score-1">${HeadToHeadView.Common.htmlEncode(data.data.score1)}</div>
                <div id="units-1">${HeadToHeadView.Common.htmlEncode(data.data.units)}</div>
                <div id="glitch-1"></div>
                <div id="display-2"></div>
                <div id="player-2">${HeadToHeadView.Common.htmlEncode(data.data.player2)}</div>
                <div id="twitch-2">${HeadToHeadView.Common.htmlEncode(data.data.twitch2)}</div>
                <div id="score-2">${HeadToHeadView.Common.htmlEncode(data.data.score2)}</div>
                <div id="units-2">${HeadToHeadView.Common.htmlEncode(data.data.units)}</div>
                <div id="glitch-2"></div>
                <div id="timer"><div>0</div>:<div>0</div><div>0</div>:<div>0</div><div>0</div>.<div>0</div><div>0</div></div>
                <div id="banner"></div>
                <div id="recent">${HeadToHeadView.GameRecentView.get()}</div>
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

/** @type {typeof import("../../../web/includes/common")} */
// @ts-ignore
HeadToHeadView.Common = typeof Common === "undefined" ? require("../../../web/includes/common") : Common; // eslint-disable-line no-undef
/** @type {typeof import("./game/recent")} */
// @ts-ignore
HeadToHeadView.GameRecentView = typeof GameRecentView === "undefined" ? require("./game/recent") : GameRecentView; // eslint-disable-line no-undef
/** @type {typeof import("./spotify")} */
// @ts-ignore
HeadToHeadView.SpotifyView = typeof SpotifyView === "undefined" ? require("./game/spotify") : SpotifyView; // eslint-disable-line no-undef
/** @type {typeof import("./game/support")} */
// @ts-ignore
HeadToHeadView.GameSupportView = typeof GameSupportView === "undefined" ? require("./game/support") : GameSupportView; // eslint-disable-line no-undef
/** @type {typeof import("./game/title")} */
// @ts-ignore
HeadToHeadView.GameTitleView = typeof GameTitleView === "undefined" ? require("./game/title") : GameTitleView; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.HeadToHeadView = HeadToHeadView;
} else {
    module.exports = HeadToHeadView; // eslint-disable-line no-undef
}
