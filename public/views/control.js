/**
 * @typedef {import("../../types/viewTypes").ControlViewParameters} ViewTypes.ControlViewParameters
 */

// MARK: class ControlView
/**
 * A class that represents the control view.
 */
class ControlView {
    // MARK: static get
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
                    <option class="scene" data-scene="roncli Gaming v2" data-path="/views/control/roncli-gaming.js" data-class="RoncliGamingView" data-api="/api/roncliGaming">roncli Gaming</button>
                    <option class="scene" data-scene="roncli Gaming v2" data-path="/views/control/tetris.js" data-class="TetrisView" data-api="/api/tetris">Tetris</button>
                </select>
                <button id="scene-go">Go</button>
                <button id="reset">Reset</button>
            </div>
            <div id="discord">
                Discord Overlay<br />
                <select id="channel-list">
                    ${data.discordChannels.map((d) => /* html */`
                        <option class="channel" data-guild-id="${ControlView.Common.htmlEncode(d.guildId)}" data-channel-id="${ControlView.Common.htmlEncode(d.channelId)}">${d.name}</option>
                    `).join("")}
                </select>
                <button id="channel-go">Go</button>
            </div>
            <div id="timer">
                Timer<br />
                <button class="timer" data-type="elapsed">Elapsed</button>
            </div>
            <div id="actions">
                Actions<br />
                <select id="action-list">
                    ${data.actions.map((a) => /* html */`
                        <option class="action" data-overlay="${ControlView.Common.htmlEncode(a.overlay)}" data-sound-path="${ControlView.Common.htmlEncode(a.soundPath)}">${a.name}</option>
                    `).join("")}
                </select>
                <button id="action-go">Go</button>
            </div>
            <div id="lighting">
                Lighting<br />
                <select id="lighting-list">
                    <option class="lighting" data-lighting="fire">Fire</option>
                    <option class="lighting" data-lighting="main">Main</option>
                </select>
                <button id="lighting-go">Go</button>
            </div>
            <div id="twitch">
                Twitch<br />
                <button class="api" data-api="/api/twitch/refresh" data-method="POST">Refresh Tokens</button>
                <button class="twitch hidden" data-path="/views/control/bit-leaderboard.js" data-class="BitLeaderboardView" data-api="/api/twitch/bit-leaderboard">Bit Leaderboard</button>
                <button class="twitch hidden" data-path="/views/control/events.js" data-class="EventsView" data-api="/api/twitch/events">Events</button>
            </div>
            <div id="settings">
                Settings<br />
                <button class="setting" data-settings="Discord Channels" data-path="/js/?files=/views/control/discord-channel.js,/views/control/discord-channels.js" data-class="DiscordChannelsView" data-subclass="DiscordChannelView" data-api="/api/config/discordChannels">Discord Channels</button>
                <button class="setting" data-settings="Actions" data-path="/js/?files=/views/control/action.js,/views/control/actions.js" data-class="ActionsView" data-subclass="ActionView" data-api="/api/config/actions">Actions</button>
                <button class="setting" data-settings="Commands" data-path="/js/?files=/views/control/command.js,/views/control/commands.js" data-class="CommandsView" data-subclass="CommandView" data-api="/api/config/commands">Commands</button>
            </div><br />
            <div id="scene"></div>
            <div id="setting"></div>
            <div id="twitch"></div>
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
