/** @typedef {import("../../../types/viewTypes").SpotifyPlaylist} ViewTypes.SpotifyPlaylist */

//   ###                  #       #      ##          ####    ##                   ##      #            #            #   #    #
//  #   #                 #             #  #         #   #    #                    #                   #            #   #
//  #      # ##    ###   ####    ##     #     #   #  #   #    #     ###   #   #    #     ##     ###   ####    ###   #   #   ##     ###   #   #
//   ###   ##  #  #   #   #       #    ####   #   #  ####     #        #  #   #    #      #    #       #     #       # #     #    #   #  #   #
//      #  ##  #  #   #   #       #     #     #  ##  #        #     ####  #  ##    #      #     ###    #      ###    # #     #    #####  # # #
//  #   #  # ##   #   #   #  #    #     #      ## #  #        #    #   #   ## #    #      #        #   #  #      #   # #     #    #      # # #
//   ###   #       ###     ##    ###    #         #  #       ###    ####      #   ###    ###   ####     ##   ####     #     ###    ###    # #
//         #                                  #   #                       #   #
//         #                                   ###                         ###
/**
 * A class that represents the Spotify playlists settings view.
 */
class SpotifyPlaylistsView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered Spotify playlists settings template.
     * @param {{data: ViewTypes.SpotifyPlaylist[]}} playlists The Spotify playlists to render.
     * @returns {string} An HTML string of the Spotify playlists settings view.
     */
    static get(playlists) {
        return /* html */`
            <div>
                Spotify Playlists<br />
                ${playlists.data.map((p) => SpotifyPlaylistsView.SpotifyPlaylistView.get(p)).join("")}
                ${SpotifyPlaylistsView.SpotifyPlaylistView.get({}, true)}
                <button class="settings-save" data-key="spotifyPlaylists">Save</button>
                <button class="settings-cancel">Cancel</button>
            </div>
        `;
    }
}

/** @type {typeof import("./spotify-playlist")} */
// @ts-ignore
SpotifyPlaylistsView.SpotifyPlaylistView = typeof Common === "undefined" ? require("./spotify-playlist") : SpotifyPlaylistView; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.SpotifyPlaylistsView = SpotifyPlaylistsView;
} else {
    module.exports = SpotifyPlaylistsView; // eslint-disable-line no-undef
}
