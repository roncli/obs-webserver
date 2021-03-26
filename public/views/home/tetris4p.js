//  #####          #              #              #   ####   #   #    #
//    #            #                            ##   #   #  #   #
//    #     ###   ####   # ##    ##     ###    # #   #   #  #   #   ##     ###   #   #
//    #    #   #   #     ##  #    #    #      #  #   ####    # #     #    #   #  #   #
//    #    #####   #     #        #     ###   #####  #       # #     #    #####  # # #
//    #    #       #  #  #        #        #     #   #       # #     #    #      # # #
//    #     ###     ##   #       ###   ####      #   #        #     ###    ###    # #
/**
 * A class that represents the tetris 4P view.
 */
class Tetris4PView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered page template.
     * @param {{event: {organization: string, title: string, status: string, color: string}, player1: {name: string, score: string}, player2: {name: string, score: string}, player3: {name: string, score: string}, player4: {name: string, score: string}}} data The data for the view.
     * @returns {string} An HTML string of the page.
     */
    static get(data) {
        return /* html */`
            <div id="tetris4p">
                <div id="player-1">${Tetris4PView.Common.htmlEncode(data && data.player1 && data.player1.name)}</div>
                <div id="player-2">${Tetris4PView.Common.htmlEncode(data && data.player2 && data.player2.name)}</div>
                <div id="player-3">${Tetris4PView.Common.htmlEncode(data && data.player3 && data.player3.name)}</div>
                <div id="player-4">${Tetris4PView.Common.htmlEncode(data && data.player4 && data.player4.name)}</div>
                <div id="player-1-score">${Tetris4PView.Common.htmlEncode(data && data.player1 && data.player1.score)}</div>
                <div id="player-2-score">${Tetris4PView.Common.htmlEncode(data && data.player2 && data.player2.score)}</div>
                <div id="player-3-score">${Tetris4PView.Common.htmlEncode(data && data.player3 && data.player3.score)}</div>
                <div id="player-4-score">${Tetris4PView.Common.htmlEncode(data && data.player4 && data.player4.score)}</div>
                <div id="organization"${data && data.event && data.event.color ? ` style="color: ${data.event.color};"` : ""}>${Tetris4PView.Common.htmlEncode(data && data.event && data.event.organization)}</div>
                <div id="title"${data && data.event && data.event.color ? ` style="color: ${data.event.color};"` : ""}>${Tetris4PView.Common.htmlEncode(data && data.event && data.event.title)}</div>
                <div id="status"${data && data.event && data.event.color ? ` style="color: ${data.event.color};"` : ""}>${Tetris4PView.Common.htmlEncode(data && data.event && data.event.status)}</div>
            </div>
        `;
    }
}

/** @type {typeof import("../../../web/includes/common")} */
// @ts-ignore
Tetris4PView.Common = typeof Common === "undefined" ? require("../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.Tetris4PView = Tetris4PView;
} else {
    module.exports = Tetris4PView; // eslint-disable-line no-undef
}
