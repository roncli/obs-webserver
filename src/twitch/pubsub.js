/**
 * @typedef {import("@twurple/auth").AuthProvider} AuthProvider
 */

const PubSubClient = require("@twurple/pubsub").PubSubClient;

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
     * @returns {void}
     */
    setup(authProvider) {
        this.client = new PubSubClient({authProvider});
    }
}

module.exports = PubSub;
