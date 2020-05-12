/**
 * @typedef {import("twitch").default} TwitchClient
 */

const TwitchWebhooks = require("twitch-webhooks").default,

    settings = require("../../settings");

//  #   #         #      #                    #
//  #   #         #      #                    #
//  #   #   ###   # ##   # ##    ###    ###   #   #   ###
//  # # #  #   #  ##  #  ##  #  #   #  #   #  #  #   #
//  # # #  #####  #   #  #   #  #   #  #   #  ###     ###
//  ## ##  #      ##  #  #   #  #   #  #   #  #  #       #
//  #   #   ###   # ##   #   #   ###    ###   #   #  ####
/**
 * A class that handles Twitch webhooks.
 */
class Webhooks {
    //               #
    //               #
    //  ###    ##   ###   #  #  ###
    // ##     # ##   #    #  #  #  #
    //   ##   ##     #    #  #  #  #
    // ###     ##     ##   ###  ###
    //                          #
    /**
     * Performs setup of Twitch webhooks.
     * @param {TwitchClient} twitchClient The twitch client.
     * @returns {Promise} A promise that resolves when the webhooks are setup.
     */
    async setup(twitchClient) {
        this.listener = await TwitchWebhooks.create(twitchClient, {port: settings.twitch.webhooksPort});
        this.listener.listen();
    }
}

module.exports = Webhooks;
