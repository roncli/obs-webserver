/**
 * @typedef {import("../../../types/viewTypes").DiscordChannel} ViewTypes.DiscordChannel
 */

// MARK: class DiscordChannelsView
/**
 * A class that represents the Discord channels settings view.
 */
class DiscordChannelsView {
    // MARK: static get
    /**
     * Gets the rendered Discord channels settings template.
     * @param {{data: ViewTypes.DiscordChannel[]}} channels The Discord channels to render.
     * @returns {string} An HTML string of the Discord channels settings view.
     */
    static get(channels) {
        return /* html */`
            <div>
                Discord Channels<br />
                ${channels.data.map((p) => DiscordChannelsView.DiscordChannelView.get(p)).join("")}
                ${DiscordChannelsView.DiscordChannelView.get({}, true)}
                <button class="settings-save" data-key="discordChannels">Save</button>
                <button class="settings-cancel">Cancel</button>
            </div>
        `;
    }
}

/** @type {typeof import("./discord-channel")} */
// @ts-ignore
DiscordChannelsView.DiscordChannelView = typeof DiscordChannelView === "undefined" ? require("./discord-channel") : DiscordChannelView; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.DiscordChannelsView = DiscordChannelsView;
} else {
    module.exports = DiscordChannelsView; // eslint-disable-line no-undef
}
