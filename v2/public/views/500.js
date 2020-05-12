//   ###                                      #####                              #   #    #
//  #   #                                     #                                  #   #
//  #       ###   # ##   #   #   ###   # ##   #      # ##   # ##    ###   # ##   #   #   ##     ###   #   #
//   ###   #   #  ##  #  #   #  #   #  ##  #  ####   ##  #  ##  #  #   #  ##  #   # #     #    #   #  #   #
//      #  #####  #       # #   #####  #      #      #      #      #   #  #       # #     #    #####  # # #
//  #   #  #      #       # #   #      #      #      #      #      #   #  #       # #     #    #      # # #
//   ###    ###   #        #     ###   #      #####  #      #       ###   #        #     ###    ###    # #
/**
 * A class that represents the 500 view.
 */
class ServerErrorView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered server error template.
     * @returns {string} An HTML string of the server error view.
     */
    static get() {
        return /* html */`
            <div id="error">
                <div class="section">500 - Server Error</div>
            </div>
        `;
    }
}

if (typeof module === "undefined") {
    window.ServerErrorView = ServerErrorView;
} else {
    module.exports = ServerErrorView; // eslint-disable-line no-undef
}
