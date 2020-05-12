/**
 * @typedef {import("../../types/viewTypes").ControlViewParameters} ViewTypes.ControlViewParameters
 */

//   ###                  #                    ##    #   #    #
//  #   #                 #                     #    #   #
//  #       ###   # ##   ####   # ##    ###     #    #   #   ##     ###   #   #
//  #      #   #  ##  #   #     ##  #  #   #    #     # #     #    #   #  #   #
//  #      #   #  #   #   #     #      #   #    #     # #     #    #####  # # #
//  #   #  #   #  #   #   #  #  #      #   #    #     # #     #    #      # # #
//   ###    ###   #   #    ##   #       ###    ###     #     ###    ###    # #
/**
 * A class that represents the control view.
 */
class ControlView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered control template.
     * @param {ViewTypes.ControlViewParameters} data The set of data required to render the view.
     * @returns {string} An HTML string of the control view.
     */
    static get(data) {
        return /* html */`
            <div id="scenes">
                OBS Scenes<br />
                <select id="scene-list">
                    <option class="scene" data-scene="roncli Gaming v2" data-path="/views/control/roncli-gaming.js" data-class="RoncliGamingView">roncli Gaming</button>
                </select>
                <button id="scene-go">Go</button>
            </div>
            <div id="scene"></div>
            <div id="discord">
                Discord Overlay<br />
                <select id="channel-list">
                    ${data.discordChannels.map((d) => /* html */`
                        <option class="channel" data-guild-id="${ControlView.Common.htmlEncode(d.guildId)}" data-channel-id="${ControlView.Common.htmlEncode(d.channelId)}">${d.name}</option>
                    `).join("")}
                </select>
                <button id="channel-go">Go</button>
            </div>
            <div id="music">
                Music<br />
                <select id="music-list">
                    ${data.spotifyPlaylists.map((s) => /* html */`
                        <option class="music" data-uri="${ControlView.Common.htmlEncode(s.uri)}">${s.name}</option>
                    `).join("")}
                </select>
                <button class="music-play" data-volume="100">Play</button>
                <button class="music-play" data-volume="50">50%</button>
                <button id="music-stop">Stop</button>
            </div>
            <div id="actions">
                Actions<br />
                <select id="action-list">
                    ${data.actions.map((a) => /* html */`
                        <option class="action" data-sound-path="${ControlView.Common.htmlEncode(a.soundPath)}" data-image-path="${ControlView.Common.htmlEncode(a.imagePath)}" data-image-location="${ControlView.Common.htmlEncode(a.imageLocation)}" data-reward="${ControlView.Common.htmlEncode(a.reward)}">${a.name}</option>
                    `).join("")}
                </select>
                <button id="action-go">Go</button>
            </div>
            <div id="settings">
                Settings<br />
                <button class="setting" data-settings="Discord Channels" data-path="/js/?files=/views/control/discord-channel.js,/views/control/discord-channels.js" data-class="DiscordChannelsView" data-subclass="DiscordChannelView" data-api="/api/config/discordChannels">Discord Channels</button>
                <button class="setting" data-settings="Spotify Playlists" data-path="/js/?files=/views/control/spotify-playlist.js,/views/control/spotify-playlists.js" data-class="SpotifyPlaylistsView" data-subclass="SpotifyPlaylistView" data-api="/api/config/spotifyPlaylists">Spotify Playlists</button>
                <button class="setting" data-settings="Actions" data-path="/js/?files=/views/control/action.js,/views/control/actions.js" data-class="ActionsView" data-subclass="ActionView" data-api="/api/config/actions">Actions</button>
            </div><br />
            <div id="setting"></div>
        `;
    }
}

/** @type {typeof import("../../web/includes/common")} */
// @ts-ignore
ControlView.Common = typeof Common === "undefined" ? require("../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.ControlView = ControlView;
} else {
    module.exports = ControlView; // eslint-disable-line no-undef
}
