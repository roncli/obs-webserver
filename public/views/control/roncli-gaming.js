/** @typedef {import("../../../types/viewTypes").RoncliGaming} ViewTypes.RoncliGaming */

//  ####                         ##      #     ###                   #                  #   #    #
//  #   #                         #           #   #                                     #   #
//  #   #   ###   # ##    ###     #     ##    #       ###   ## #    ##    # ##    ## #  #   #   ##     ###   #   #
//  ####   #   #  ##  #  #   #    #      #    #          #  # # #    #    ##  #  #  #    # #     #    #   #  #   #
//  # #    #   #  #   #  #        #      #    #  ##   ####  # # #    #    #   #   ##     # #     #    #####  # # #
//  #  #   #   #  #   #  #   #    #      #    #   #  #   #  # # #    #    #   #  #       # #     #    #      # # #
//  #   #   ###   #   #   ###    ###    ###    ###    ####  #   #   ###   #   #   ###     #     ###    ###    # #
//                                                                               #   #
//                                                                                ###
/**
 * A class that represents the roncli Gaming view.
 */
class RoncliGamingView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered roncli Gaming template.
     * @param {{data: ViewTypes.RoncliGaming}} data The data to render the view with.
     * @returns {string} An HTML string of the roncli Gaming view.
     */
    static get(data) {
        return /* html */`
            <div>
                roncli Gaming<br />
                <button class="transition" data-transition="Start Stream">Start Stream</button>
                <button class="transition" data-transition="Webcam">Webcam</button>
                <button class="transition" data-transition="Game">Game</button>
                <button class="transition" data-transition="CTM">CTM</button>
                <button class="transition" data-transition="BRB">BRB</button>
                <button class="transition" data-transition="End Stream">End Stream</button>
                <div class="api" data-api="/api/config/roncliGaming">
                    <div>
                        Title <textarea class="setting" data-type="title" style="width: 300px; height: 57px;">${RoncliGamingView.Common.htmlEncode(data.data.title)}</textarea><br />
                        Game <input type="text" class="setting" data-type="game" style="width: 300px;" value="${RoncliGamingView.Common.htmlEncode(data.data.game)}"><br />
                        <button id="update-twitch">Update Twitch</button>
                    </div>
                    Info <textarea class="setting" data-type="info" style="width: 300px; height: 400px;">${RoncliGamingView.Common.htmlEncode(data.data.info)}</textarea>
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
