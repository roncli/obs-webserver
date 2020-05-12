/**
 * @typedef {import("twitch").default} TwitchClient
 */

const TwitchPubSub = require("twitch-pubsub-client").default;

//  ####          #       ###          #
//  #   #         #      #   #         #
//  #   #  #   #  # ##   #      #   #  # ##
//  ####   #   #  ##  #   ###   #   #  ##  #
//  #      #   #  #   #      #  #   #  #   #
//  #      #  ##  ##  #  #   #  #  ##  ##  #
//  #       ## #  # ##    ###    ## #  # ##
/**
 * A class that handles Twitch PubSub.
 */
class PubSub {
    //               #
    //               #
    //  ###    ##   ###   #  #  ###
    // ##     # ##   #    #  #  #  #
    //   ##   ##     #    #  #  #  #
    // ###     ##     ##   ###  ###
    //                          #
    /**
     * Performs setup of Twitch PubSub.
     * @param {TwitchClient} twitchClient The twitch client.
     * @returns {Promise} A promise that resolves when the PubSub are setup.
     */
    async setup(twitchClient) {
        this.client = new TwitchPubSub();
        await this.client.registerUserListener(twitchClient);
    }
}

module.exports = PubSub;
