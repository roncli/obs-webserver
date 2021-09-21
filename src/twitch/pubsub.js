/**
 * @typedef {import("@twurple/auth").AuthProvider} AuthProvider
 */

const TwitchPubSub = require("@twurple/pubsub").PubSubClient;

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
     * @param {AuthProvider} authProvider The auth provider.
     * @returns {Promise} A promise that resolves when the PubSub are setup.
     */
    async setup(authProvider) {
        this.client = new TwitchPubSub();
        await this.client.registerUserListener(authProvider);
    }
}

module.exports = PubSub;
