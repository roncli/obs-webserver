//   ###                         ###                  #       #      ##          #   #    #
//  #   #                       #   #                 #             #  #         #   #
//  #       ###   ## #    ###   #      # ##    ###   ####    ##     #     #   #  #   #   ##     ###   #   #
//  #          #  # # #  #   #   ###   ##  #  #   #   #       #    ####   #   #   # #     #    #   #  #   #
//  #  ##   ####  # # #  #####      #  ##  #  #   #   #       #     #     #  ##   # #     #    #####  # # #
//  #   #  #   #  # # #  #      #   #  # ##   #   #   #  #    #     #      ## #   # #     #    #      # # #
//   ###    ####  #   #   ###    ###   #       ###     ##    ###    #         #    #     ###    ###    # #
//                                     #                                  #   #
//                                     #                                   ###
/**
 * A class that represents the game spotify view.
 */
class GameSpotifyView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered page template.
     * @returns {string} An HTML string of the page.
     */
    static get() {
        if (!GameSpotifyView.Home || !GameSpotifyView.Home.spotifyTrack || !GameSpotifyView.Home.spotifyTrack.playing) {
            return "";
        }

        return /* html */`
            <div class="now-playing">
                Now Playing<br />
                <span class="text">
                    ${GameSpotifyView.Common.htmlEncode(GameSpotifyView.Home.spotifyTrack.artist)}<br />
                    ${GameSpotifyView.Common.htmlEncode(GameSpotifyView.Home.spotifyTrack.title)}
                </span>
            </div>
            ${GameSpotifyView.Home.spotifyTrack.imageUrl ? /* html */`
                <div class="artwork">
                    <img src="${GameSpotifyView.Home.spotifyTrack.imageUrl}" />
                </div>
            ` : ""}
        `;
    }
}

/** @type {typeof import("../../../../web/includes/common")} */
// @ts-ignore
GameSpotifyView.Common = typeof Common === "undefined" ? require("../../web/includes/common") : Common; // eslint-disable-line no-undef
// @ts-ignore
GameSpotifyView.Home = typeof Home === "undefined" ? void 0 : Home; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.GameSpotifyView = GameSpotifyView;
} else {
    module.exports = GameSpotifyView; // eslint-disable-line no-undef
}
