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
     * @returns {string} An HTML string of the roncli Gaming view.
     */
    static get() {
        return /* html */`
            <div>
                roncli Gaming<br />
                <button class="transition" data-transition="Start Stream">Start Stream</button>
                <button class="transition" data-transition="Webcam">Webcam</button>
                <button class="transition" data-transition="Main">Main</button>
                <button class="transition" data-transition="Wild Wednesday">Wild Wednesday</button>
                <button class="transition" data-transition="BRB">BRB</button>
                <button class="transition" data-transition="End Stream">End Stream</button>
            </div>
        `;
    }
}

if (typeof module === "undefined") {
    window.RoncliGamingView = RoncliGamingView;
} else {
    module.exports = RoncliGamingView; // eslint-disable-line no-undef
}
