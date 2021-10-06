//   ###   #   #  #   #    #
//  #   #  #  #   #   #
//  #   #  # #    #   #   ##     ###   #   #
//  #   #  ##      # #     #    #   #  #   #
//  #   #  # #     # #     #    #####  # # #
//  #   #  #  #    # #     #    #      # # #
//   ###   #   #    #     ###    ###    # #
/**
 * A class that represents the 200 view.
 */
class OKView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered OK template.
     * @param {string} message The message for the OK view.
     * @returns {string} An HTML string of the OK view.
     */
    static get(message) {
        return /* html */`
            <div class="text">${message}</div>
        `;
    }
}

if (typeof module === "undefined") {
    window.OKView = OKView;
} else {
    module.exports = OKView; // eslint-disable-line no-undef
}
