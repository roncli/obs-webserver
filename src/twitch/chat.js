/**
 * @typedef {import("@twurple/auth").AuthProvider} AuthProvider
 */

const ChatClient = require("@twurple/chat").ChatClient,

    settings = require("../../settings");

// MARK: class Chat
/**
 * A class that handles Twitch chat.
 */
class Chat {
    // MARK: constructor
    /**
     * Performs setup of Twitch chat.
     * @param {AuthProvider} authProvider The auth provider.
     */
    constructor(authProvider) {
        this.client = new ChatClient({
            authProvider,
            channels: [settings.twitch.channelName],
            requestMembershipEvents: true
        });
    }
}

module.exports = Chat;
