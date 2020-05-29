//   ###                        #   #          #       #      ##     #                   #       #                  #   #    #
//  #   #                       #   #          #             #  #                        #                          #   #
//  #       ###   ## #    ###   ##  #   ###   ####    ##     #      ##     ###    ###   ####    ##     ###   # ##   #   #   ##     ###   #   #
//  #          #  # # #  #   #  # # #  #   #   #       #    ####     #    #   #      #   #       #    #   #  ##  #   # #     #    #   #  #   #
//  #  ##   ####  # # #  #####  #  ##  #   #   #       #     #       #    #       ####   #       #    #   #  #   #   # #     #    #####  # # #
//  #   #  #   #  # # #  #      #   #  #   #   #  #    #     #       #    #   #  #   #   #  #    #    #   #  #   #   # #     #    #      # # #
//   ###    ####  #   #   ###   #   #   ###     ##    ###    #      ###    ###    ####    ##    ###    ###   #   #    #     ###    ###    # #
/**
 * A class that represents the game notification view.
 */
class GameNotificationView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered page template.
     * @param {string} image The image for the notification.
     * @param {string} sound The sound to use for the notification.
     * @param {string} html The HTML of the notification.
     * @returns {string} An HTML string of the page.
     */
    static get(image, sound, html) {
        return /* html */`
            <div class="notification">
                <div>
                    <img src="${image}" />
                    ${sound ? /* html */`
                        <audio autoplay>
                            <source src="${sound}" type="audio/ogg">
                        </audio>
                    ` : ""}
                </div>
                <div>${html}</div>
            </div>
        `;
    }
}

if (typeof module === "undefined") {
    window.GameNotificationView = GameNotificationView;
} else {
    module.exports = GameNotificationView; // eslint-disable-line no-undef
}
