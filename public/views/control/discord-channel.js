/**
 * @typedef {import("../../../types/viewTypes").DiscordChannel} ViewTypes.DiscordChannel
 */

// MARK: class DiscordChannelView
/**
 * A class that represents the Discoord channel settings view.
 */
class DiscordChannelView {
    // MARK: static get
    /**
     * Gets the rendered Discord channel setting template.
     * @param {ViewTypes.DiscordChannel} channel The Discord channel to render.
     * @param {boolean} [add] Whether this is a new row to add or an existing row to remove.
     * @returns {string} An HTML string of the Discord channel settings view.
     */
    static get(channel, add) {
        return /* html */`
            <div class="settings-row${add ? " settings-new" : ""}">
                ${add ? "" : /* html */`
                    <span draggable="true" class="draggable emoji">↕</span>
                `}
                Name: <input type="text" data-field="name" value="${DiscordChannelView.Common.htmlEncode(channel.name)}" />
                Guild ID: <input type="text" data-field="guildId" value="${DiscordChannelView.Common.htmlEncode(channel.guildId)}" />
                Channel ID: <input type="text" data-field="channelId" value="${DiscordChannelView.Common.htmlEncode(channel.channelId)}" />
                <button class="emoji ${add ? "add" : "remove"}">${add ? "➕" : "❌"}</button>
            </div>
        `;
    }
}

/** @type {typeof import("../../../web/includes/common")} */
// @ts-ignore
DiscordChannelView.Common = typeof Common === "undefined" ? require("../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.DiscordChannelView = DiscordChannelView;
} else {
    module.exports = DiscordChannelView; // eslint-disable-line no-undef
}
