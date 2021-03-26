//  #####          #              #           #   #    #
//    #            #                          #   #
//    #     ###   ####   # ##    ##     ###   #   #   ##     ###   #   #
//    #    #   #   #     ##  #    #    #       # #     #    #   #  #   #
//    #    #####   #     #        #     ###    # #     #    #####  # # #
//    #    #       #  #  #        #        #   # #     #    #      # # #
//    #     ###     ##   #       ###   ####     #     ###    ###    # #
/**
 * A class that represents the Tetris view.
 */
class TetrisView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered Tetris template.
     * @returns {string} An HTML string of the roncli Gaming view.
     */
    static get() {
        return /* html */`
            <div>
                Tetris<br />
                <button class="transition" data-transition="Start Tetris">Start Tetris</button>
                <button class="transition" data-transition="Tetris BRB">BRB</button>
                <button class="transition" data-transition="2P12">2P - Players 1 & 2</button>
                <button class="transition" data-transition="2P34">2P - Players 3 & 4</button>
                <button class="transition" data-transition="4P">4P</button>
                <button class="transition" data-transition="End Tetris">End Tetris</button><br />
                <div class="api" data-api="/api/tetris">
                    <div>
                        Organization <input type="text" id="event-organization" class="setting" data-type="event-organization" style="width: 100px;"><br />
                        Title <input type="text" id="event-title" class="setting" data-type="event-title" style="width: 100px;"><br />
                        Status <input type="text" id="event-status" class="setting" data-type="event-status" style="width: 100px;"><br />
                        Color <input type="text" id="event-color" class="setting" data-type="event-color" value="#ffffff"><br />
                    </div>
                    <div>
                        Player 1 <input type="text" id="player-1" class="setting" data-type="player-1" style="width: 100px;"><br />
                        Score <input type="number" id="player-1-score" min="0" max="9" class="setting" data-type="player-1-score" style="width: 100px;" value="0"><br />
                        Info <textarea id="player-1-info" class="setting" data-type="player-1-info" style="width: 100px; height: 57px;"></textarea><br />
                        <button id="player-1-start">Start Player 1</button>
                    </div>
                    <div>
                        Player 2 <input type="text" id="player-2" class="setting" data-type="player-2" style="width: 100px;"><br />
                        Score <input type="number" id="player-2-score" min="0" max="9" class="setting" data-type="player-2-score" style="width: 100px;" value="0"><br />
                        Info <textarea id="player-2-info" class="setting" data-type="player-2-info" style="width: 100px; height: 57px;"></textarea><br />
                        <button id="player-2-start">Start Player 2</button>
                    </div>
                    <div>
                        Player 3 <input type="text" id="player-3" class="setting" data-type="player-3" style="width: 100px;"><br />
                        Score <input type="number" id="player-3-score" min="0" max="9" class="setting" data-type="player-3-score" style="width: 100px;" value="0"><br />
                        Info <textarea id="player-3-info" class="setting" data-type="player-3-info" style="width: 100px; height: 57px;"></textarea><br />
                        <button id="player-3-start">Start Player 3</button>
                    </div>
                    <div>
                        Player 4 <input type="text" id="player-4" class="setting" data-type="player-4" style="width: 100px;"><br />
                        Score <input type="number" id="player-4-score" min="0" max="9" class="setting" data-type="player-4-score" style="width: 100px;" value="0"><br />
                        Info <textarea id="player-4-info" class="setting" data-type="player-4-info" style="width: 100px; height: 57px;"></textarea><br />
                        <button id="player-4-start">Start Player 4</button>
                    </div>
                </div>
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
