/**
 * @typedef {import("../../types/viewTypes").IndexViewParameters} ViewTypes.IndexViewParameters
 */

//   ###              #                #   #    #
//    #               #                #   #
//    #    # ##    ## #   ###   #   #  #   #   ##     ###   #   #
//    #    ##  #  #  ##  #   #   # #    # #     #    #   #  #   #
//    #    #   #  #   #  #####    #     # #     #    #####  # # #
//    #    #   #  #  ##  #       # #    # #     #    #      # # #
//   ###   #   #   ## #   ###   #   #    #     ###    ###    # #
/**
 * A class that represents the general website template.
 */
class IndexView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered page template.
     * @param {ViewTypes.IndexViewParameters} data The data to render the page with.
     * @returns {string} An HTML string of the page.
     */
    static get(data) {
        const {head, html} = data;

        return /* html */`
            <html>
                <head>
                    <link rel="icon" type="image/png" href="data:image/png;base64,iVBORw0KGgo=">
                    <title>roncli Gaming</title>
                    ${head}
                </head>
                <body>
                    ${html}
                </body>
            </html>
        `;
    }
}

/** @type {typeof import("../../web/includes/common")} */
// @ts-ignore
IndexView.Common = typeof Common === "undefined" ? require("../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.IndexView = IndexView;
} else {
    module.exports = IndexView; // eslint-disable-line no-undef
}
