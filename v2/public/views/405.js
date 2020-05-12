//  #   #          #     #                 #  #   #          #       #     ##     ##                             #  #   #    #
//  #   #          #     #                 #  #   #          #      # #     #      #                             #  #   #
//  ## ##   ###   ####   # ##    ###    ## #  ##  #   ###   ####   #   #    #      #     ###   #   #   ###    ## #  #   #   ##     ###   #   #
//  # # #  #   #   #     ##  #  #   #  #  ##  # # #  #   #   #     #   #    #      #    #   #  #   #  #   #  #  ##   # #     #    #   #  #   #
//  #   #  #####   #     #   #  #   #  #   #  #  ##  #   #   #     #####    #      #    #   #  # # #  #####  #   #   # #     #    #####  # # #
//  #   #  #       #  #  #   #  #   #  #  ##  #   #  #   #   #  #  #   #    #      #    #   #  # # #  #      #  ##   # #     #    #      # # #
//  #   #   ###     ##   #   #   ###    ## #  #   #   ###     ##   #   #   ###    ###    ###    # #    ###    ## #    #     ###    ###    # #
/**
 * A class that represents the 405 view.
 */
class MethodNotAllowedView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered method not allowed template.
     * @param {string} message The message for the method not allowed view.
     * @returns {string} An HTML string of the method not allowed view.
     */
    static get(message) {
        return /* html */`
            <div id="error">
                <div class="section">405 - Method Not Allowed</div>
                <div class="text">${message}</div>
            </div>
        `;
    }
}

if (typeof module === "undefined") {
    window.MethodNotAllowedView = MethodNotAllowedView;
} else {
    module.exports = MethodNotAllowedView; // eslint-disable-line no-undef
}
