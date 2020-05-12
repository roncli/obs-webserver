//  #   #          #     #####                           #  #   #    #
//  #   #          #     #                               #  #   #
//  ##  #   ###   ####   #       ###   #   #  # ##    ## #  #   #   ##     ###   #   #
//  # # #  #   #   #     ####   #   #  #   #  ##  #  #  ##   # #     #    #   #  #   #
//  #  ##  #   #   #     #      #   #  #   #  #   #  #   #   # #     #    #####  # # #
//  #   #  #   #   #  #  #      #   #  #  ##  #   #  #  ##   # #     #    #      # # #
//  #   #   ###     ##   #       ###    ## #  #   #   ## #    #     ###    ###    # #
/**
 * A class that represents the 404 view.
 */
class NotFoundView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered not found template.
     * @param {string} message The message for the not found view.
     * @returns {string} An HTML string of the not found view.
     */
    static get(message) {
        return /* html */`
            <div id="error">
                <div class="section">404 - Not Found</div>
                <div class="text">${message}</div>
            </div>
        `;
    }
}

if (typeof module === "undefined") {
    window.NotFoundView = NotFoundView;
} else {
    module.exports = NotFoundView; // eslint-disable-line no-undef
}
