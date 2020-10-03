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
     * @param {boolean} [control] Determines whether to display a link to return to the control page.
     * @param {string} [text] The text to display on the page.
     * @returns {string} An HTML string of the server error view.
     */
    static get(control, text) {
        return /* html */`
            <div id="error">
                <div class="section">500 - Server Error</div>
                ${text ? /* html */`
                    <div>${text}</div>
                ` : ""}
                ${control ? /* html */`
                    <a href="/control">Return to Control page</a>
                ` : ""}
            </div>
        `;
    }
}

if (typeof module === "undefined") {
    window.ServerErrorView = ServerErrorView;
} else {
    module.exports = ServerErrorView; // eslint-disable-line no-undef
}
