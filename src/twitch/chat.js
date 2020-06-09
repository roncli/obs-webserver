/**
 * @typedef {import("twitch").default} TwitchClient
 */

const ChatClient = require("twitch-chat-client").default,

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
class Chat {
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
        this.client = ChatClient.forTwitchClient(twitchClient, {
            channels: [settings.twitch.channelName],
            requestMembershipEvents: true
        });
    }
}

module.exports = Chat;
