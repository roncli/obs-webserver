/**
 * @typedef {import("@twurple/auth").AuthProvider} AuthProvider
 * @typedef {import("@twurple/chat").ChatClient} ChatClient
 */

const events = require("events"),
    IGDB = require("igdb-api-node"),
    TwitchAuth = require("@twurple/auth"),
    TwitchClient = require("@twurple/api").ApiClient,

    Chat = require("./chat"),
    ConfigFile = require("../configFile"),
    Log = require("../logging/log"),
    PubSub = require("./pubsub"),

    settings = require("../../settings");

/** @type {TwitchAuth.AppTokenAuthProvider} */
let apiAuthProvider;

/** @type {string} */
let botAccessToken;

/** @type {TwitchAuth.RefreshingAuthProvider} */
let botAuthProvider;

/** @type {string} */
let botRefreshToken;

/** @type {Chat} */
let botChatClient;

/** @type {TwitchClient} */
let botTwitchClient;

/** @type {string} */
let channelAccessToken;

/** @type {TwitchAuth.RefreshingAuthProvider} */
let channelAuthProvider;

/** @type {string} */
let channelRefreshToken;

/** @type {TwitchClient} */
let channelTwitchClient;

/** @type {Chat} */
let channelChatClient;

/** @type {PubSub} */
let pubsub;

const eventEmitter = new events.EventEmitter();

//  #####           #     #            #
//    #                   #            #
//    #    #   #   ##    ####    ###   # ##
//    #    #   #    #     #     #   #  ##  #
//    #    # # #    #     #     #      #   #
//    #    # # #    #     #  #  #   #  #   #
//    #     # #    ###     ##    ###   #   #
/**
 * Handles Twitch integration.
 */
class Twitch {
    //        ##
    //         #
    //  ###    #     ##    ##   ###
    // ##      #    # ##  # ##  #  #
    //   ##    #    ##    ##    #  #
    // ###    ###    ##    ##   ###
    //                          #
    /**
     * Sleeps the thread for the specified time.
     * @param {number} ms The number of milliseconds to sleep for.
     * @returns {Promise} A promise that resolves when the sleep period has completed.
     */
    static sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    // #            #     ##   #            #     ##   ##     #                 #
    // #            #    #  #  #            #    #  #   #                       #
    // ###    ##   ###   #     ###    ###  ###   #      #    ##     ##   ###   ###
    // #  #  #  #   #    #     #  #  #  #   #    #      #     #    # ##  #  #   #
    // #  #  #  #   #    #  #  #  #  # ##   #    #  #   #     #    ##    #  #   #
    // ###    ##     ##   ##   #  #   # #    ##   ##   ###   ###    ##   #  #    ##
    /**
     * Gets the current Twitch bot client.
     * @returns {ChatClient} The current Twitch bot client.
     */
    static get botChatClient() {
        return botChatClient.client;
    }

    //       #                             ##    ###          #     #          #      ##   ##     #                 #
    //       #                              #     #                 #          #     #  #   #                       #
    //  ##   ###    ###  ###   ###    ##    #     #    #  #  ##    ###    ##   ###   #      #    ##     ##   ###   ###
    // #     #  #  #  #  #  #  #  #  # ##   #     #    #  #   #     #    #     #  #  #      #     #    # ##  #  #   #
    // #     #  #  # ##  #  #  #  #  ##     #     #    ####   #     #    #     #  #  #  #   #     #    ##    #  #   #
    //  ##   #  #   # #  #  #  #  #   ##   ###    #    ####  ###     ##   ##   #  #   ##   ###   ###    ##   #  #    ##
    /**
     * Gets the current Twitch client.
     * @returns {TwitchClient} The current Twitch client.
     */
    static get channelTwitchClient() {
        return channelTwitchClient;
    }

    //                          #
    //                          #
    //  ##   # #    ##   ###   ###    ###
    // # ##  # #   # ##  #  #   #    ##
    // ##    # #   ##    #  #   #      ##
    //  ##    #     ##   #  #    ##  ###
    /**
     * Returns the EventEmitter for Twitch events.
     * @returns {events.EventEmitter} The EventEmitter object.
     */
    static get events() {
        return eventEmitter;
    }

    //                                      #
    //                                      #
    //  ##    ##   ###   ###    ##    ##   ###
    // #     #  #  #  #  #  #  # ##  #      #
    // #     #  #  #  #  #  #  ##    #      #
    //  ##    ##   #  #  #  #   ##    ##     ##
    /**
     * Connects to Twitch.
     * @returns {Promise<boolean>} Returns whether the Twitch client is ready.
     */
    static async connect() {
        channelAccessToken ||= ConfigFile.get("channelAccessToken");
        channelRefreshToken ||= ConfigFile.get("channelRefreshToken");
        botAccessToken ||= ConfigFile.get("botAccessToken");
        botRefreshToken ||= ConfigFile.get("botRefreshToken");

        if (!channelAccessToken || !channelRefreshToken || !botAccessToken || !botRefreshToken) {
            return false;
        }

        if (!channelAuthProvider || !botAuthProvider) {
            Log.log("Logging into Twitch...");
            try {
                await Twitch.login();
            } catch (err) {
                Log.exception("Error connecting to Twitch.  You can try again by refreshing the control page.", err);
            }

            Log.log("Connected to Twitch.");
        }

        return !!(channelAuthProvider && botAuthProvider);
    }

    // ##                 #
    //  #
    //  #     ##    ###  ##    ###
    //  #    #  #  #  #   #    #  #
    //  #    #  #   ##    #    #  #
    // ###    ##   #     ###   #  #
    //              ###
    /**
     * Logs in to Twitch and creates the Twitch client.
     * @returns {Promise} A promise that resolves when login is complete.
     */
    static async login() {
        channelAuthProvider = new TwitchAuth.RefreshingAuthProvider({
            clientId: settings.twitch.clientId,
            clientSecret: settings.twitch.clientSecret
        });

        channelAuthProvider.onRefresh(async (userId, token) => {
            channelAccessToken = token.accessToken;
            channelRefreshToken = token.refreshToken;
            await ConfigFile.set({
                channelAccessToken,
                channelRefreshToken
            });
        });

        await channelAuthProvider.addUserForToken({
            accessToken: channelAccessToken,
            refreshToken: channelRefreshToken,
            expiresIn: 0,
            obtainmentTimestamp: 0,
            scope: settings.twitch.channelScopes
        }, ["chat"]);

        channelTwitchClient = new TwitchClient({
            authProvider: channelAuthProvider
        });

        await channelTwitchClient.requestScopesForUser(settings.twitch.channelUserId, settings.twitch.channelScopes);

        botAuthProvider = new TwitchAuth.RefreshingAuthProvider({
            clientId: settings.twitch.clientId,
            clientSecret: settings.twitch.clientSecret
        });

        await botAuthProvider.addUserForToken({
            accessToken: botAccessToken,
            refreshToken: botRefreshToken,
            expiresIn: void 0,
            obtainmentTimestamp: void 0,
            scope: settings.twitch.botScopes
        }, ["chat"]);

        botAuthProvider.onRefresh(async (userId, token) => {
            botAccessToken = token.accessToken;
            botRefreshToken = token.refreshToken;
            await ConfigFile.set({
                botAccessToken,
                botRefreshToken
            });
        });

        botTwitchClient = new TwitchClient({
            authProvider: botAuthProvider
        });

        await botTwitchClient.requestScopesForUser(settings.twitch.botUserId, settings.twitch.botScopes);

        apiAuthProvider = new TwitchAuth.AppTokenAuthProvider(settings.twitch.clientId, settings.twitch.clientSecret);

        await Twitch.setupChat();
        await Twitch.setupPubSub();
    }

    // ##                             #
    //  #                             #
    //  #     ##    ###   ##   #  #  ###
    //  #    #  #  #  #  #  #  #  #   #
    //  #    #  #   ##   #  #  #  #   #
    // ###    ##   #      ##    ###    ##
    //              ###
    /**
     * Logs out of Twitch.
     * @returns {Promise} A promise that resolves when the logout is complete.
     */
    static async logout() {
        try {
            await channelChatClient.client.quit();
        } catch (err) {}
        channelChatClient = void 0;

        try {
            await botChatClient.client.quit();
        } catch (err) {}
        botChatClient = void 0;
    }

    //               #                      #     ###         #
    //              # #                     #      #          #
    // ###    ##    #    ###    ##    ###   ###    #     ##   # #    ##   ###    ###
    // #  #  # ##  ###   #  #  # ##  ##     #  #   #    #  #  ##    # ##  #  #  ##
    // #     ##     #    #     ##      ##   #  #   #    #  #  # #   ##    #  #    ##
    // #      ##    #    #      ##   ###    #  #   #     ##   #  #   ##   #  #  ###
    /**
     * Refreshes Twitch tokens.
     * @returns {Promise} A promsie that resolves when the tokens are refreshed.
     */
    static async refreshTokens() {
        try {
            await channelAuthProvider.refreshAccessTokenForUser(settings.twitch.channelUserId);
            await botAuthProvider.refreshAccessTokenForUser(settings.twitch.botUserId);
        } catch (err) {
            eventEmitter.emit("error", {
                message: "Error refreshing twitch client tokens.",
                err
            });
        }

        await Twitch.logout();
        await Twitch.connect();
        await Twitch.login();
    }

    //                    ##      #
    //                   #  #     #
    // ###   #  #  ###   #  #   ###
    // #  #  #  #  #  #  ####  #  #
    // #     #  #  #  #  #  #  #  #
    // #      ###  #  #  #  #   ###
    /**
     * Runs an ad on Twitch.
     * @returns {Promise} A promise that resolves when the ad has been started.
     */
    static async runAd() {
        try {
            await channelTwitchClient.channels.startChannelCommercial(settings.twitch.channelUserId, 120);
        } catch (err) {
            eventEmitter.emit("error", {
                message: "Error running an ad.",
                err
            });
        }
    }

    //                                #      ##                     #      #            #
    //                                #     #  #                    #                   #
    //  ###    ##    ###  ###    ##   ###   #      ###  # #    ##   #     ##     ###   ###
    // ##     # ##  #  #  #  #  #     #  #  # ##  #  #  ####  # ##  #      #    ##      #
    //   ##   ##    # ##  #     #     #  #  #  #  # ##  #  #  ##    #      #      ##    #
    // ###     ##    # #  #      ##   #  #   ###   # #  #  #   ##   ####  ###   ###      ##
    /**
     * Searches IGDB for a game.
     * @param {string} search The game to search for.
     * @returns {Promise<any>} The game from IGDB.
     */
    static async searchGameList(search) {
        try {
            const client = IGDB.default(apiAuthProvider.clientId, (await apiAuthProvider.getAppAccessToken()).accessToken),
                res = await client.where(`name ~ "${search.replace(/"/g, "\\\"")}"*`).fields(["id", "name", "cover.url"]).limit(50).request("/games");

            return res.data;
        } catch (err) {
            eventEmitter.emit("error", {
                message: "Error searching the game list.",
                err
            });
            return [];
        }
    }

    //               #     ##    #                            ###           #
    //               #    #  #   #                             #           # #
    //  ###    ##   ###    #    ###   ###    ##    ###  # #    #    ###    #     ##
    // ##     # ##   #      #    #    #  #  # ##  #  #  ####   #    #  #  ###   #  #
    //   ##   ##     #    #  #   #    #     ##    # ##  #  #   #    #  #   #    #  #
    // ###     ##     ##   ##     ##  #      ##    # #  #  #  ###   #  #   #     ##
    /**
     * Sets the stream's title and game.
     * @param {string} title The title of the stream.
     * @param {string} game The game.
     * @returns {Promise} A promise that resolves when the stream's info has been set.
     */
    static async setStreamInfo(title, game) {
        let gameId;
        try {
            const gameData = await channelTwitchClient.games.getGameByName(game);

            gameId = gameData.id;
        } catch (err) {}

        await channelTwitchClient.channels.updateChannelInfo(settings.twitch.channelUserId, {title, gameId});
    }

    //               #                 ##   #            #
    //               #                #  #  #            #
    //  ###    ##   ###   #  #  ###   #     ###    ###  ###
    // ##     # ##   #    #  #  #  #  #     #  #  #  #   #
    //   ##   ##     #    #  #  #  #  #  #  #  #  # ##   #
    // ###     ##     ##   ###  ###    ##   #  #   # #    ##
    //                          #
    /**
     * Sets up the Twitch chat.
     * @returns {Promise} A promise that resolves when the Twitch chat is setup.
     */
    static async setupChat() {
        if (channelChatClient && channelChatClient.client) {
            try {
                await channelChatClient.client.quit();
            } catch (err) {} finally {}
        }
        channelChatClient = new Chat(channelAuthProvider);

        if (botChatClient && botChatClient.client) {
            try {
                await botChatClient.client.quit();
            } catch (err) {} finally {}
        }

        botChatClient = new Chat(botAuthProvider);

        channelChatClient.client.onAction((channel, user, message, msg) => {
            eventEmitter.emit("action", {
                channel: channel.charAt(0) === "#" ? channel.substr(1) : channel,
                user,
                name: msg.userInfo.displayName,
                message
            });
        });

        channelChatClient.client.onCommunityPayForward((channel, user, forwardInfo) => {
            eventEmitter.emit("subGiftCommunityPayForward", {
                channel: channel.charAt(0) === "#" ? channel.substr(1) : channel,
                user,
                name: forwardInfo.displayName,
                originalGifter: forwardInfo.originalGifterDisplayName
            });
        });

        channelChatClient.client.onCommunitySub((channel, user, subInfo) => {
            eventEmitter.emit("subGiftCommunity", {
                channel: channel.charAt(0) === "#" ? channel.substr(1) : channel,
                user,
                name: subInfo.gifterDisplayName,
                giftCount: subInfo.count,
                totalGiftCount: subInfo.gifterGiftCount,
                tier: subInfo.plan
            });
        });

        channelChatClient.client.onDisconnect((manually, reason) => {
            if (reason) {
                if (!reason.message || reason.message.indexOf("1006") === -1) {
                    Log.exception("The streamer's Twitch chat disconnected.", reason);
                }
            }
        });

        channelChatClient.client.onGiftPaidUpgrade((channel, user, subInfo) => {
            eventEmitter.emit("subGiftUpgrade", {
                channel: channel.charAt(0) === "#" ? channel.substr(1) : channel,
                user,
                name: subInfo.displayName,
                gifter: subInfo.gifterDisplayName
            });
        });

        channelChatClient.client.onMessage((channel, user, message, msg) => {
            eventEmitter.emit("message", {
                channel: channel.charAt(0) === "#" ? channel.substr(1) : channel,
                user,
                name: msg.userInfo.displayName,
                message,
                msg // TODO: Implement this.
            });
        });

        channelChatClient.client.onPrimeCommunityGift((channel, user, subInfo) => {
            eventEmitter.emit("giftPrime", {
                channel: channel.charAt(0) === "#" ? channel.substr(1) : channel,
                user: subInfo.gifter,
                name: subInfo.gifterDisplayName,
                gift: subInfo.name
            });
        });

        channelChatClient.client.onPrimePaidUpgrade((channel, user, subInfo) => {
            eventEmitter.emit("subPrimeUpgraded", {
                channel: channel.charAt(0) === "#" ? channel.substr(1) : channel,
                user,
                name: subInfo.displayName,
                tier: subInfo.plan
            });
        });

        channelChatClient.client.onRaid((channel, user, raidInfo) => {
            eventEmitter.emit("raided", {
                channel: channel.charAt(0) === "#" ? channel.substr(1) : channel,
                user,
                name: raidInfo.displayName,
                viewerCount: raidInfo.viewerCount
            });
        });

        channelChatClient.client.onResub((channel, user, subInfo) => {
            eventEmitter.emit("resub", {
                channel: channel.charAt(0) === "#" ? channel.substr(1) : channel,
                user,
                name: subInfo.displayName,
                isPrime: subInfo.isPrime,
                message: subInfo.message,
                months: subInfo.months,
                streak: subInfo.streak,
                tier: subInfo.plan
            });
        });

        channelChatClient.client.onRitual((channel, user, ritualInfo, msg) => {
            eventEmitter.emit("ritual", {
                channel: channel.charAt(0) === "#" ? channel.substr(1) : channel,
                user,
                name: msg.userInfo.displayName,
                message: ritualInfo.message,
                ritual: ritualInfo.ritualName
            });
        });

        channelChatClient.client.onStandardPayForward((channel, user, forwardInfo) => {
            eventEmitter.emit("subGiftPayForward", {
                channel: channel.charAt(0) === "#" ? channel.substr(1) : channel,
                user,
                name: forwardInfo.displayName,
                originalGifter: forwardInfo.originalGifterDisplayName,
                recipient: forwardInfo.recipientDisplayName
            });
        });

        channelChatClient.client.onSub((channel, user, subInfo) => {
            eventEmitter.emit("sub", {
                channel: channel.charAt(0) === "#" ? channel.substr(1) : channel,
                user,
                name: subInfo.displayName,
                isPrime: subInfo.isPrime,
                message: subInfo.message,
                months: subInfo.months,
                streak: subInfo.streak,
                tier: subInfo.plan
            });
        });

        channelChatClient.client.onSubExtend((channel, user, subInfo) => {
            eventEmitter.emit("subExtend", {
                channel: channel.charAt(0) === "#" ? channel.substr(1) : channel,
                user,
                displayName: subInfo.displayName,
                months: subInfo.months,
                tier: subInfo.plan
            });
        });

        channelChatClient.client.onSubGift((channel, user, subInfo) => {
            eventEmitter.emit("subGift", {
                channel: channel.charAt(0) === "#" ? channel.substr(1) : channel,
                user,
                name: subInfo.displayName,
                gifterUser: subInfo.gifter,
                gifterName: subInfo.gifterDisplayName,
                totalGiftCount: subInfo.gifterGiftCount,
                isPrime: subInfo.isPrime,
                message: subInfo.message,
                months: subInfo.months,
                streak: subInfo.streak,
                tier: subInfo.plan
            });
        });

        channelChatClient.client.onWhisper((user, message, msg) => {
            eventEmitter.emit("whisper", {
                user,
                name: msg.userInfo.displayName,
                message
            });
        });

        botChatClient.client.onDisconnect((manually, reason) => {
            if (reason) {
                if (!reason.message || reason.message.indexOf("1006") === -1) {
                    Log.exception("The bot's Twitch chat disconnected.", reason);
                }
            }
        });

        if (!channelChatClient.client.isConnected) {
            channelChatClient.client.connect();
        }

        if (!botChatClient.client.isConnected) {
            botChatClient.client.connect();
        }
    }

    //               #                ###         #      ##         #
    //               #                #  #        #     #  #        #
    //  ###    ##   ###   #  #  ###   #  #  #  #  ###    #    #  #  ###
    // ##     # ##   #    #  #  #  #  ###   #  #  #  #    #   #  #  #  #
    //   ##   ##     #    #  #  #  #  #     #  #  #  #  #  #  #  #  #  #
    // ###     ##     ##   ###  ###   #      ###  ###    ##    ###  ###
    //                          #
    /**
     * Sets up the Twitch PubSub subscriptions.
     * @returns {Promise} A promise that resolves when the Twitch PubSub subscriptions are setup.
     */
    static async setupPubSub() {
        pubsub = new PubSub();

        await pubsub.setup(channelTwitchClient._authProvider);

        pubsub.client.onBits(settings.twitch.channelUserId, async (message) => {
            const displayName = message.userId ? (await channelTwitchClient.users.getUserById(message.userId)).displayName : "";

            eventEmitter.emit("bits", {
                userId: message.userId,
                user: message.userName,
                name: displayName,
                bits: message.bits,
                totalBits: message.totalBits,
                message: message.message,
                isAnonymous: message.isAnonymous
            });
        });

        pubsub.client.onRedemption(settings.twitch.channelUserId, (message) => {
            eventEmitter.emit("redemption", {
                userId: message.userId,
                user: message.userName,
                name: message.userDisplayName,
                message: message.message,
                date: message.redemptionDate,
                cost: message.rewardCost,
                reward: message.rewardTitle,
                isQueued: message.rewardIsQueued
            });
        });
    }
}

module.exports = Twitch;
