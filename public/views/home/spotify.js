//   ###                  #       #      ##          #   #    #
//  #   #                 #             #  #         #   #
//  #      # ##    ###   ####    ##     #     #   #  #   #   ##     ###   #   #
//   ###   ##  #  #   #   #       #    ####   #   #   # #     #    #   #  #   #
//      #  ##  #  #   #   #       #     #     #  ##   # #     #    #####  # # #
//  #   #  # ##   #   #   #  #    #     #      ## #   # #     #    #      # # #
//   ###   #       ###     ##    ###    #         #    #     ###    ###    # #
//         #                                  #   #
//         #                                   ###
/**
 * A class that represents the game spotify view.
 */
class SpotifyView {
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
        if (!SpotifyView.Home || !SpotifyView.Home.spotifyTrack || !SpotifyView.Home.spotifyTrack.playing) {
            return "";
        }

        return /* html */`
            <div class="now-playing">
                Now Playing<br />
                <span class="text">
                    ${SpotifyView.Common.htmlEncode(SpotifyView.Home.spotifyTrack.artist)}<br />
                    ${SpotifyView.Common.htmlEncode(SpotifyView.Home.spotifyTrack.title)}
                </span>
            </div>
            ${SpotifyView.Home.spotifyTrack.imageUrl ? /* html */`
                <div class="artwork">
                    <img src="${SpotifyView.Home.spotifyTrack.imageUrl}" />
                </div>
            ` : ""}
        `;
    }
}

/** @type {typeof import("../../../web/includes/common")} */
// @ts-ignore
SpotifyView.Common = typeof Common === "undefined" ? require("../../web/includes/common") : Common; // eslint-disable-line no-undef
// @ts-ignore
SpotifyView.Home = typeof Home === "undefined" ? void 0 : Home; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.SpotifyView = SpotifyView;
} else {
    module.exports = SpotifyView; // eslint-disable-line no-undef
}
