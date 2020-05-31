/** @typedef {import("../../../types/viewTypes").DiscordChannel} ViewTypes.DiscordChannel */

//  ####     #                                    #   ###   #                                   ##           #   #    #
//   #  #                                         #  #   #  #                                    #           #   #
//   #  #   ##     ###    ###    ###   # ##    ## #  #      # ##    ###   # ##   # ##    ###     #     ###   #   #   ##     ###   #   #
//   #  #    #    #      #   #  #   #  ##  #  #  ##  #      ##  #      #  ##  #  ##  #  #   #    #    #       # #     #    #   #  #   #
//   #  #    #     ###   #      #   #  #      #   #  #      #   #   ####  #   #  #   #  #####    #     ###    # #     #    #####  # # #
//   #  #    #        #  #   #  #   #  #      #  ##  #   #  #   #  #   #  #   #  #   #  #        #        #   # #     #    #      # # #
//  ####    ###   ####    ###    ###   #       ## #   ###   #   #   ####  #   #  #   #   ###    ###   ####     #     ###    ###    # #
/**
 * A class that represents the Discord channels settings view.
 */
class DiscordChannelsView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered Discord channels settings template.
     * @param {{data: ViewTypes.DiscordChannel[]}} playlists The Discord channels to render.
     * @returns {string} An HTML string of the Discord channels settings view.
     */
    static get(playlists) {
        return /* html */`
            <div>
                Discord Channels<br />
                ${playlists.data.map((p) => DiscordChannelsView.DiscordChannelView.get(p)).join("")}
                ${DiscordChannelsView.DiscordChannelView.get({}, true)}
                <button class="settings-save" data-key="discordChannels">Save</button>
                <button class="settings-cancel">Cancel</button>
            </div>
        `;
    }
}

/** @type {typeof import("./discord-channel")} */
// @ts-ignore
DiscordChannelsView.DiscordChannelView = typeof DiscordChannelView === "undefined" ? require("./discord-channels") : DiscordChannelView; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.DiscordChannelsView = DiscordChannelsView;
} else {
    module.exports = DiscordChannelsView; // eslint-disable-line no-undef
}
