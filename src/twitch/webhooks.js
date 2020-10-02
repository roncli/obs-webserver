/**
 * @typedef {import("twitch").ApiClient} TwitchClient
 */

const PublicIP = require("public-ip"),
    TwitchWebhooks = require("twitch-webhooks").WebHookListener,
    SimpleAdapter = require("twitch-webhooks").SimpleAdapter,

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
        this.listener = new TwitchWebhooks(twitchClient, new SimpleAdapter({
            hostName: await PublicIP.v4(),
            listenerPort: settings.twitch.webhooksPort
        }));

        this.listener.listen();
    }
}

module.exports = Webhooks;
