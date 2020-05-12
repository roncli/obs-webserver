/**
 * @typedef {import("twitch").default} TwitchClient
 */

const TwitchChat = require("twitch-chat-client").default,

    settings = require("../../settings");

//   ###   #              #
//  #   #  #              #
//  #      # ##    ###   ####
//  #      ##  #      #   #
//  #      #   #   ####   #
//  #   #  #   #  #   #   #  #
//   ###   #   #   ####    ##
/**
 * A class that handles Twitch chat.
 */
class PubSub {
    //                           #                       #
    //                           #                       #
    //  ##    ##   ###    ###   ###   ###   #  #   ##   ###    ##   ###
    // #     #  #  #  #  ##      #    #  #  #  #  #      #    #  #  #  #
    // #     #  #  #  #    ##    #    #     #  #  #      #    #  #  #
    //  ##    ##   #  #  ###      ##  #      ###   ##     ##   ##   #
    /**
     * Performs setup of Twitch chat.
     * @param {TwitchClient} twitchClient The twitch client.
     */
    constructor(twitchClient) {
        this.client = TwitchChat.forTwitchClient(twitchClient, {
            channels: [settings.twitch.channelName],
            requestMembershipEvents: true
        });
        this.client.connect();
    }
}

module.exports = PubSub;
