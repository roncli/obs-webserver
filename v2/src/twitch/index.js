const events = require("events"),
    request = require("@root/request"),
    TwitchClient = require("twitch").default,

    Chat = require("./chat"),
    ConfigFile = require("../configFile"),
    PubSub = require("./pubsub"),
    Webhooks = require("./webhooks"),

    settings = require("../../settings");

/** @type {string} */
let chatAccessToken;

/** @type {TwitchClient} */
let twitchChatClient;

/** @type {string} */
let accessToken;

/** @type {string} */
let refreshToken;

/** @type {TwitchClient} */
let twitchClient;

/** @type {Chat} */
let chat;

/** @type {PubSub} */
let pubsub;

/** @type {Webhooks} */
let webhooks;

/** @type {NodeJS.Timeout} */
let refreshInterval;

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

    //  #           #     #          #      ##   ##     #                 #
    //  #                 #          #     #  #   #                       #
    // ###   #  #  ##    ###    ##   ###   #      #    ##     ##   ###   ###
    //  #    #  #   #     #    #     #  #  #      #     #    # ##  #  #   #
    //  #    ####   #     #    #     #  #  #  #   #     #    ##    #  #   #
    //   ##  ####  ###     ##   ##   #  #   ##   ###   ###    ##   #  #    ##
    /**
     * Gets the current Twitch client.
     * @returns {TwitchClient} The current Twitch client.
     */
    static get twitchClient() {
        return twitchClient;
    }

    //              #     ##                                   ###         #
    //              #    #  #                                   #          #
    //  ###   ##   ###   #  #   ##    ##    ##    ###    ###    #     ##   # #    ##   ###
    // #  #  # ##   #    ####  #     #     # ##  ##     ##      #    #  #  ##    # ##  #  #
    //  ##   ##     #    #  #  #     #     ##      ##     ##    #    #  #  # #   ##    #  #
    // #      ##     ##  #  #   ##    ##    ##   ###    ###     #     ##   #  #   ##   #  #
    //  ###
    /**
     * Gets the Twitch access token from the OAuth code and logs in.
     * @param {string} code The code returned from the OAuth flow.
     * @returns {Promise} A promise that resolves when the access token is retrieved.
     */
    static async getAccessToken(code) {
        const res = await request.post(`https://id.twitch.tv/oauth2/token?client_id=${settings.twitch.clientId}&client_secret=${settings.twitch.clientSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(`http://localhost:${settings.express.port}/oauth`)}`);

        const body = JSON.parse(res.body);

        const chatRes = await request(`https://twitchtokengenerator.com/api/refresh/${settings.twitch.chatRefreshToken}`);

        const chatBody = JSON.parse(chatRes.body);

        chatAccessToken = chatBody.token;

        await Twitch.login({accessToken: body.access_token, refreshToken: body.refresh_token});
    }

    //              #    ###            #   #                       #    #  #        ##
    //              #    #  #           #                           #    #  #         #
    //  ###   ##   ###   #  #   ##    ###  ##    ###    ##    ##   ###   #  #  ###    #
    // #  #  # ##   #    ###   # ##  #  #   #    #  #  # ##  #      #    #  #  #  #   #
    //  ##   ##     #    # #   ##    #  #   #    #     ##    #      #    #  #  #      #
    // #      ##     ##  #  #   ##    ###  ###   #      ##    ##     ##   ##   #     ###
    //  ###
    /**
     * Gets the redirect URL for logging into Twitch.
     * @returns {string} The redirect URL to log into Twitch.
     */
    static getRedirectUrl() {
        return `https://id.twitch.tv/oauth2/authorize?client_id=${settings.twitch.clientId}&redirect_uri=${encodeURIComponent(`http://localhost:${settings.express.port}/oauth`)}&response_type=code&scope=${encodeURIComponent(settings.twitch.scopes.join(" "))}`;
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
        accessToken = accessToken || ConfigFile.get("accessToken");
        refreshToken = refreshToken || ConfigFile.get("refreshToken");

        if (!accessToken || !refreshToken || !twitchClient || !twitchChatClient) {
            return false;
        }

        try {
            await twitchClient.refreshAccessToken();
            await twitchChatClient.refreshAccessToken();
        } catch (err) {
            return false;
        }

        return true;
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
     * @param {{accessToken: string, refreshToken: string}} tokens The tokens to login with.
     * @returns {Promise} A promise that resolves when login is complete.
     */
    static async login(tokens) {
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }

        accessToken = tokens.accessToken;
        refreshToken = tokens.refreshToken;

        twitchClient = TwitchClient.withCredentials(settings.twitch.clientId, accessToken, settings.twitch.scopes, {
            clientSecret: settings.twitch.clientSecret,
            refreshToken,
            onRefresh: (token) => accessToken = token.accessToken
        }, {
            initialScopes: settings.twitch.scopes,
            preAuth: true
        });

        twitchChatClient = TwitchClient.withCredentials(settings.twitch.clientId, chatAccessToken, settings.twitch.chatScopes, {
            clientSecret: settings.twitch.clientSecret,
            refreshToken: settings.twitch.chatRefreshToken,
            onRefresh: (token) => chatAccessToken = token.accessToken
        }, {
            initialScopes: settings.twitch.chatScopes,
            preAuth: true
        });

        await Twitch.setupChat();
        await Twitch.setupPubSub();
        await Twitch.setupWebhooks();

        refreshInterval = setInterval(async () => {
            try {
                await twitchClient.refreshAccessToken();
                await twitchChatClient.refreshAccessToken();
            } catch (err) {
                eventEmitter.emit("error", {
                    message: "Error refreshing twitch client tokens.",
                    err
                });
            }

            await Twitch.setupChat();
            await Twitch.setupPubSub();
            await Twitch.setupWebhooks();
        }, 24 * 60 * 60 * 1000); // TODO: Test with a lower time.
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
        if (chat && chat.client) {
            try {
                await chat.client.quit();
            } finally {}
        }

        chat = new Chat(twitchChatClient);

        chat.client.onAction((channel, user, message) => {
            eventEmitter.emit("action", {
                channel,
                user,
                message
            });
        });

        chat.client.onCommunityPayForward((channel, user, forwardInfo) => {
            eventEmitter.emit("subGiftPayForward", {
                channel,
                user,
                originalGifter: forwardInfo.originalGifterDisplayName
            });
        });

        chat.client.onCommunitySub((channel, user, subInfo) => {
            eventEmitter.emit("subGiftCommunity", {
                channel,
                user,
                giftCount: subInfo.count,
                totalGiftCount: subInfo.gifterGiftCount,
                tier: subInfo.plan
            });
        });

        chat.client.onDisconnect(async (manually) => {
            if (!manually) {
                await Twitch.setupChat();
            }
        });

        chat.client.onGiftPaidUpgrade((channel, user, subInfo) => {
            eventEmitter.emit("subGiftUpgrade", {
                channel,
                user,
                gifter: subInfo.gifterDisplayName,
                tier: subInfo.plan
            });
        });

        chat.client.onHost((channel, target, viewers) => {
            eventEmitter.emit("host", {
                channel,
                user: target,
                viewerCount: viewers
            });
        });

        chat.client.onHosted((channel, byChannel, auto, viewers) => {
            eventEmitter.emit("hosted", {
                channel,
                user: byChannel,
                auto,
                viewerCount: viewers
            });
        });

        chat.client.onPrimeCommunityGift((channel, user, subInfo) => {
            eventEmitter.emit("giftPrime", {
                channel,
                user,
                gifter: subInfo.gifterDisplayName,
                gift: subInfo.name
            });
        });

        chat.client.onPrimePaidUpgrade((channel, user, subInfo) => {
            eventEmitter.emit("subPrimeUpgraded", {
                channel,
                user,
                tier: subInfo.plan
            });
        });

        chat.client.onPrivmsg((channel, user, message) => {
            eventEmitter.emit("message", {
                channel,
                user,
                message
            });
        });

        chat.client.onRaid((channel, user, raidInfo) => {
            eventEmitter.emit("raided", {
                channel,
                user,
                viewerCount: raidInfo.viewerCount
            });
        });

        chat.client.onResub((channel, user, subInfo) => {
            eventEmitter.emit("resub", {
                channel,
                user,
                isPrime: subInfo.isPrime,
                message: subInfo.message,
                months: subInfo.months,
                streak: subInfo.streak,
                tier: subInfo.plan
            });
        });

        chat.client.onRitual((channel, user, ritualInfo) => {
            eventEmitter.emit("ritual", {
                channel,
                user,
                message: ritualInfo.message,
                ritual: ritualInfo.ritualName
            });
        });

        chat.client.onStandardPayForward((channel, user, forwardInfo) => {
            eventEmitter.emit("subPayForward", {
                channel,
                user,
                originalGifter: forwardInfo.originalGifterDisplayName,
                recipient: forwardInfo.recipientDisplayName
            });
        });

        chat.client.onSub((channel, user, subInfo) => {
            eventEmitter.emit("sub", {
                channel,
                user,
                isPrime: subInfo.isPrime,
                message: subInfo.message,
                months: subInfo.months,
                streak: subInfo.streak,
                tier: subInfo.plan
            });
        });

        chat.client.onSubExtend((channel, user, subInfo) => {
            eventEmitter.emit("subExtend", {
                channel,
                user,
                months: subInfo.months,
                tier: subInfo.plan
            });
        });

        chat.client.onSubGift((channel, user, subInfo) => {
            eventEmitter.emit("subGift", {
                channel,
                user,
                gifter: subInfo.gifterDisplayName,
                totalGiftCount: subInfo.gifterGiftCount,
                isPrime: subInfo.isPrime,
                message: subInfo.message,
                months: subInfo.months,
                streak: subInfo.streak,
                tier: subInfo.plan
            });
        });

        chat.client.onWhisper((user, message) => {
            eventEmitter.emit("whisper", {
                user,
                message
            });
        });
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

        await pubsub.setup(twitchClient);

        pubsub.client.onBits(settings.twitch.userId, async (message) => {
            eventEmitter.emit("bits", {
                userId: message.userId,
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
            try {
                webhooks.listener.unlisten();
            } finally {}
        }

        webhooks = new Webhooks();

        await webhooks.setup(twitchClient);

        webhooks.listener.subscribeToFollowsToUser(settings.twitch.userId, (follow) => {
            eventEmitter.emit("follow", {
                userId: follow.userId,
                name: follow.userDisplayName,
                date: follow.followDate
            });
        });

        webhooks.listener.subscribeToStreamChanges(settings.twitch.userId, async (stream) => {
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
        });
    }
}

module.exports = Twitch;
