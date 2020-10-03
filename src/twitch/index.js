/**
 * @typedef {import("twitch").AuthProvider} AuthProvider
 * @typedef {import("twitch-chat-client").ChatClient} ChatClient
 * @typedef {import("twitch-webhooks").Subscription} WebhooksSubscriptions
 */

const events = require("events"),
    TwitchAuth = require("twitch-auth"),
    TwitchClient = require("twitch").ApiClient,

    Chat = require("./chat"),
    ConfigFile = require("../configFile"),
    Log = require("../logging/log"),
    PubSub = require("./pubsub"),
    Webhooks = require("./webhooks"),

    settings = require("../../settings");

/** @type {string} */
let botAccessToken;

/** @type {AuthProvider} */
let botAuthProvider;

/** @type {string} */
let botRefreshToken;

/** @type {Chat} */
let botChatClient;

/** @type {TwitchClient} */
let botTwitchClient;

/** @type {string} */
let channelAccessToken;

/** @type {AuthProvider} */
let channelAuthProvider;

/** @type {string} */
let channelRefreshToken;

/** @type {TwitchClient} */
let channelTwitchClient;

/** @type {Chat} */
let channelChatClient;

/** @type {PubSub} */
let pubsub;

/** @type {NodeJS.Timeout} */
let refreshInterval;

/** @type {Webhooks} */
let webhooks;

/** @type {WebhooksSubscriptions[]} */
const webhookSubscriptions = [];

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

    //  #           ###                  #
    //              #  #                 #
    // ##     ###   #  #   ##    ###   ###  #  #
    //  #    ##     ###   # ##  #  #  #  #  #  #
    //  #      ##   # #   ##    # ##  #  #   # #
    // ###   ###    #  #   ##    # #   ###    #
    //                                       #
    /**
     * Checks if the Twitch client is ready.
     * @returns {Promise<boolean>} Returns whether the Twitch client is ready.
     */
    static async isReady() {
        channelAccessToken = channelAccessToken || ConfigFile.get("channelAccessToken");
        channelRefreshToken = channelRefreshToken || ConfigFile.get("channelRefreshToken");
        botAccessToken = botAccessToken || ConfigFile.get("botAccessToken");
        botRefreshToken = botRefreshToken || ConfigFile.get("botRefreshToken");

        if (!channelAccessToken || !channelRefreshToken || !botAccessToken || !botRefreshToken) {
            return false;
        }

        if (!channelAuthProvider || !botAuthProvider) {
            await Twitch.login();
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
        channelAuthProvider = new TwitchAuth.RefreshableAuthProvider(
            new TwitchAuth.StaticAuthProvider(settings.twitch.clientId, channelAccessToken, settings.twitch.channelScopes, "user"),
            {
                clientSecret: settings.twitch.clientSecret,
                expiry: null,
                refreshToken: channelRefreshToken,
                onRefresh: async (token) => {
                    channelAccessToken = token.accessToken;
                    channelRefreshToken = token.refreshToken;
                    await ConfigFile.set({
                        channelAccessToken,
                        channelRefreshToken
                    });
                }
            }
        );

        channelTwitchClient = new TwitchClient({
            authProvider: channelAuthProvider,
            initialScopes: settings.twitch.channelScopes,
            preAuth: true
        });

        botAuthProvider = new TwitchAuth.RefreshableAuthProvider(
            new TwitchAuth.StaticAuthProvider(settings.twitch.clientId, botAccessToken, settings.twitch.botScopes, "user"),
            {
                clientSecret: settings.twitch.clientSecret,
                expiry: null,
                refreshToken: botRefreshToken,
                onRefresh: async (token) => {
                    botAccessToken = token.accessToken;
                    botRefreshToken = token.refreshToken;
                    await ConfigFile.set({
                        botAccessToken,
                        botRefreshToken
                    });
                }
            }
        );

        botTwitchClient = new TwitchClient({
            authProvider: botAuthProvider,
            initialScopes: settings.twitch.botScopes,
            preAuth: true
        });

        await Twitch.setupChat();
        await Twitch.setupPubSub();
        await Twitch.setupWebhooks();

        // TODO: Should work, but needs investigation to see if it's needed.
        // refreshInterval = setInterval(Twitch.refreshTokens, 24 * 60 * 60 * 1000);
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
            await channelAuthProvider.refresh();
            await botAuthProvider.refresh();
        } catch (err) {
            eventEmitter.emit("error", {
                message: "Error refreshing twitch client tokens.",
                err
            });
        }

        await Twitch.setupChat();
        await Twitch.setupPubSub();
        await Twitch.setupWebhooks();
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
        await channelTwitchClient.kraken.channels.updateChannel(settings.twitch.userId, {status: title, game});
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
        channelChatClient = new Chat(channelTwitchClient);

        if (botChatClient && botChatClient.client) {
            try {
                await botChatClient.client.quit();
            } catch (err) {} finally {}
        }

        botChatClient = new Chat(botTwitchClient);

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

        channelChatClient.client.onDisconnect(async (manually, reason) => {
            if (reason) {
                Log.exception("The streamer's Twitch chat disconnected.", reason);
            }

            if (!manually) {
                await Twitch.setupChat();
            }
        });

        channelChatClient.client.onGiftPaidUpgrade((channel, user, subInfo) => {
            eventEmitter.emit("subGiftUpgrade", {
                channel: channel.charAt(0) === "#" ? channel.substr(1) : channel,
                user,
                name: subInfo.displayName,
                gifter: subInfo.gifterDisplayName,
                tier: subInfo.plan
            });
        });

        channelChatClient.client.onHost(async (channel, target, viewers) => {
            let user;
            try {
                user = (await channelTwitchClient.kraken.search.searchChannels(target)).find((c) => c.displayName === target);
            } catch (err) {} finally {}

            eventEmitter.emit("host", {
                channel: channel.charAt(0) === "#" ? channel.substr(1) : channel,
                user: user ? user.name : target,
                name: target,
                viewerCount: viewers
            });
        });

        channelChatClient.client.onHosted(async (channel, byChannel, auto, viewers) => {
            let user;
            try {
                user = (await channelTwitchClient.kraken.search.searchChannels(byChannel)).find((c) => c.displayName === byChannel);
            } catch (err) {} finally {}

            eventEmitter.emit("hosted", {
                channel: channel.charAt(0) === "#" ? channel.substr(1) : channel,
                user: user ? user.name : byChannel,
                name: byChannel.charAt(0) === "#" ? byChannel.substr(1) : byChannel,
                auto,
                viewerCount: viewers
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

        channelChatClient.client.onPrivmsg((channel, user, message, msg) => {
            eventEmitter.emit("message", {
                channel: channel.charAt(0) === "#" ? channel.substr(1) : channel,
                user,
                name: msg.userInfo.displayName,
                message,
                msg // TODO: Implement this.
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

        botChatClient.client.onDisconnect(async (manually, reason) => {
            if (reason) {
                Log.exception("The bot's Twitch chat disconnected.", reason);
            }

            if (!manually) {
                await Twitch.setupChat();
            }
        });

        channelChatClient.client.connect();
        botChatClient.client.connect();
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

        await pubsub.setup(channelTwitchClient);

        pubsub.client.onBits(settings.twitch.userId, async (message) => {
            eventEmitter.emit("bits", {
                userId: message.userId,
                user: message.userName,
                name: (await message.getUser()).displayName,
                bits: message.bits,
                totalBits: message.totalBits,
                message: message.message,
                isAnonymous: message.isAnonymous
            });
        });

        pubsub.client.onRedemption(settings.twitch.userId, (message) => {
            eventEmitter.emit("redemption", {
                userId: message.userId,
                user: message.userName,
                name: message.userDisplayName,
                message: message.message,
                date: message.redemptionDate,
                cost: message.rewardCost,
                reward: message.rewardName,
                isQueued: message.rewardIsQueued
            });
        });
    }

    //               #                #  #        #     #                 #
    //               #                #  #        #     #                 #
    //  ###    ##   ###   #  #  ###   #  #   ##   ###   ###    ##    ##   # #    ###
    // ##     # ##   #    #  #  #  #  ####  # ##  #  #  #  #  #  #  #  #  ##    ##
    //   ##   ##     #    #  #  #  #  ####  ##    #  #  #  #  #  #  #  #  # #     ##
    // ###     ##     ##   ###  ###   #  #   ##   ###   #  #   ##    ##   #  #  ###
    //                          #
    /**
     * Sets up the Twitch Webhooks subscriptions.
     * @returns {Promise} A promise that resolves when the Twitch Webhooks subscriptions are setup.
     */
    static async setupWebhooks() {
        if (webhooks && webhooks.listener) {
            for (const sub of webhookSubscriptions) {
                await sub.stop();
            }
        }

        await Twitch.sleep(1000);

        webhooks = new Webhooks();

        await webhooks.setup(channelTwitchClient);

        webhookSubscriptions.push(await webhooks.listener.subscribeToFollowsToUser(settings.twitch.userId, async (follow) => {
            eventEmitter.emit("follow", {
                userId: follow.userId,
                user: (await follow.getUser()).name,
                name: follow.userDisplayName,
                date: follow.followDate
            });
        }));

        webhookSubscriptions.push(await webhooks.listener.subscribeToStreamChanges(settings.twitch.userId, async (stream) => {
            if (stream) {
                const game = await stream.getGame();

                eventEmitter.emit("stream", {
                    title: stream.title,
                    game: game ? game.name : "",
                    id: stream.id,
                    startDate: stream.startDate,
                    thumbnailUrl: stream.thumbnailUrl
                });
            } else {
                eventEmitter.emit("offline");
            }
        }));
    }
}

module.exports = Twitch;
