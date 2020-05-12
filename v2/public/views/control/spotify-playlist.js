/** @typedef {import("../../../types/viewTypes").SpotifyPlaylist} ViewTypes.SpotifyPlaylist */

//   ###                  #       #      ##          ####    ##                   ##      #            #     #   #    #
//  #   #                 #             #  #         #   #    #                    #                   #     #   #
//  #      # ##    ###   ####    ##     #     #   #  #   #    #     ###   #   #    #     ##     ###   ####   #   #   ##     ###   #   #
//   ###   ##  #  #   #   #       #    ####   #   #  ####     #        #  #   #    #      #    #       #      # #     #    #   #  #   #
//      #  ##  #  #   #   #       #     #     #  ##  #        #     ####  #  ##    #      #     ###    #      # #     #    #####  # # #
//  #   #  # ##   #   #   #  #    #     #      ## #  #        #    #   #   ## #    #      #        #   #  #   # #     #    #      # # #
//   ###   #       ###     ##    ###    #         #  #       ###    ####      #   ###    ###   ####     ##     #     ###    ###    # #
//         #                                  #   #                       #   #
//         #                                   ###                         ###
/**
 * A class that represents the Spotify playlist settings view.
 */
class SpotifyPlaylistView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered Spotify playlists setting template.
     * @param {ViewTypes.SpotifyPlaylist} playlist The Spotify playlist to render.
     * @param {boolean} [add] Whether this is a new row to add or an existing row to remove.
     * @returns {string} An HTML string of the Spotify playlist settings view.
     */
    static get(playlist, add) {
        return /* html */`
            <div class="settings-row${add ? " settings-new" : ""}">
                ${add ? "" : /* html */`
                    <span draggable="true" class="draggable emoji">↕</span>
                `}
                Name: <input type="text" data-field="name" value="${SpotifyPlaylistView.Common.htmlEncode(playlist.name)}" />
                URI: <input type="text" data-field="uri" value="${SpotifyPlaylistView.Common.htmlEncode(playlist.uri)}" />
                <button class="emoji ${add ? "add" : "remove"}">${add ? "➕" : "❌"}</button>
            </div>
        `;
    }
}

/** @type {typeof import("../../../web/includes/common")} */
// @ts-ignore
SpotifyPlaylistView.Common = typeof Common === "undefined" ? require("../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.SpotifyPlaylistView = SpotifyPlaylistView;
} else {
    module.exports = SpotifyPlaylistView; // eslint-disable-line no-undef
}
