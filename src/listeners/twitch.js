/**
 * @typedef {import("../../types/twitchListenerTypes").ActionEvent} TwitchListenerTypes.ActionEvent
 * @typedef {import("../../types/twitchListenerTypes").BitsEvent} TwitchListenerTypes.BitsEvent
 * @typedef {import("../../types/twitchListenerTypes").ErrorEvent} TwitchListenerTypes.ErrorEvent
 * @typedef {import("../../types/twitchListenerTypes").FollowEvent} TwitchListenerTypes.FollowEvent
 * @typedef {import("../../types/twitchListenerTypes").GiftPrimeEvent} TwitchListenerTypes.GiftPrimeEvent
 * @typedef {import("../../types/twitchListenerTypes").MessageEvent} TwitchListenerTypes.MessageEvent
 * @typedef {import("../../types/twitchListenerTypes").RaidedEvent} TwitchListenerTypes.RaidedEvent
 * @typedef {import("../../types/twitchListenerTypes").RedemptionEvent} TwitchListenerTypes.RedemptionEvent
 * @typedef {import("../../types/twitchListenerTypes").ResubEvent} TwitchListenerTypes.ResubEvent
 * @typedef {import("../../types/twitchListenerTypes").RitualEvent} TwitchListenerTypes.RitualEvent
 * @typedef {import("../../types/twitchListenerTypes").StreamEvent} TwitchListenerTypes.StreamEvent
 * @typedef {import("../../types/twitchListenerTypes").SubEvent} TwitchListenerTypes.SubEvent
 * @typedef {import("../../types/twitchListenerTypes").SubExtendEvent} TwitchListenerTypes.SubExtendEvent
 * @typedef {import("../../types/twitchListenerTypes").SubGiftEvent} TwitchListenerTypes.SubGiftEvent
 * @typedef {import("../../types/twitchListenerTypes").SubGiftCommunityEvent} TwitchListenerTypes.SubGiftCommunityEvent
 * @typedef {import("../../types/twitchListenerTypes").SubGiftCommunityPayForwardEvent} TwitchListenerTypes.SubGiftCommunityPayForwardEvent
 * @typedef {import("../../types/twitchListenerTypes").SubGiftPayForwardEvent} TwitchListenerTypes.SubGiftPayForwardEvent
 * @typedef {import("../../types/twitchListenerTypes").SubGiftUpgradeEvent} TwitchListenerTypes.SubGiftUpgradeEvent
 * @typedef {import("../../types/twitchListenerTypes").SubPrimeUpgradedEvent} TwitchListenerTypes.SubPrimeUpgradedEvent
 * @typedef {import("../../types/twitchListenerTypes").WhisperEvent} TwitchListenerTypes.WhisperEvent
 * @typedef {import("../../types/viewTypes").Command} ViewTypes.Command
 */

const Color = require("../color"),
    ConfigFile = require("../configFile"),
    Lighting = require("../lighting"),
    Log = require("../logging/log"),
    Notifications = require("../notifications"),
    Twitch = require("../twitch"),

    settings = require("../../settings"),

    colorABoxRegex = /^(?<box>[1-9]|1[0-6]) #?(?<color>[0-9a-f]{6})$/i;

/** @type {{[x: string]: boolean}} */
const cooldown = {};

// MARK: class TwitchListener
/**
 * A class that handles listening to Twitch events.
 */
class TwitchListener {
    // MARK: static getTierName
    /**
     * Gets the tier name based on the data from the Twitch API.
     * @param {string} tier The tier from the Twitch API.
     * @param {boolean} isPrime Whether the sub is a Prime sub.
     * @returns {string} The tier name.
     */
    static getTierName(tier, isPrime) {
        switch (tier) {
            case "2000":
                return "Firebomber";
            case "3000":
                return "Pyromaniac";
            case "Prime":
            case "1000":
            default:
                return `${isPrime || tier === "Prime" ? "Prime " : ""}Demolitionist`;
        }
    }

    // MARK: static action
    /**
     * Handles a chat action, ie: when the /me command is used.
     * @param {TwitchListenerTypes.ActionEvent} ev The action event.
     * @returns {void}
     */
    static action(ev) {
        if (ev.channel === settings.twitch.channelName) {
        }
    }

    // MARK: static bits
    /**
     * Handles when bits are cheered in the channel.
     * @param {TwitchListenerTypes.BitsEvent} ev The bits event.
     * @returns {void}
     */
    static bits(ev) {
        Notifications.add("bits", ev, "alert");
        if (ev.isAnonymous) {
            Twitch.botChatClient.say(settings.twitch.channelName, `There has been an anonymous cheer of ${ev.name} bit${ev.bits === 1 ? "" : "s"}!`);
        } else {
            Twitch.botChatClient.say(settings.twitch.channelName, `Thanks ${ev.name} for cheering with ${ev.bits} bit${ev.bits === 1 ? "" : "s"}!${ev.totalBits && ev.totalBits !== ev.bits ? `  They have cheered a total of ${ev.totalBits} bits!` : ""}`);
        }
    }

    // MARK: static error
    /**
     * Handles an error thrown from Twitch.
     * @param {TwitchListenerTypes.ErrorEvent} ev The error event.
     * @returns {void}
     */
    static error(ev) {
        Log.exception("An error event was received from Twitch.", ev);
    }

    // MARK: static follow
    /**
     * Handles when the channel is followed.
     * @param {TwitchListenerTypes.FollowEvent} ev The follow event.
     * @returns {void}
     */
    static follow(ev) {
        Notifications.add("follow", ev, "alert");
        Twitch.botChatClient.say(settings.twitch.channelName, `Thank you for following roncli Gaming, ${ev.name}!`);
    }

    // MARK: static giftPrime
    /**
     * Handles when a Prime gift is given.
     * @param {TwitchListenerTypes.GiftPrimeEvent} ev The gift prime event.
     * @returns {void}
     */
    static giftPrime(ev) {
        if (ev.channel === settings.twitch.channelName) {
            Notifications.add("giftPrime", ev, "alert");
            Twitch.botChatClient.say(settings.twitch.channelName, `${ev.name} has gifted ${ev.gift}, a Prime gift, to the community!`);
        }
    }

    // MARK: static message
    /**
     * Handles when a message is posted in chat.
     * @param {TwitchListenerTypes.MessageEvent} ev The message event.
     * @returns {void}
     */
    static message(ev) {
        if (ev.channel === settings.twitch.channelName) {
            if (!ev.message.startsWith("!")) {
                return;
            }

            const enteredCommand = ev.message.split(" ")[0].substr(1).toLowerCase();

            if (cooldown[enteredCommand]) {
                return;
            }

            /** @type {ViewTypes.Command[]} */
            const commands = ConfigFile.get("commands"),
                command = commands.find((c) => c.name === enteredCommand);

            if (!command) {
                return;
            }

            cooldown[enteredCommand] = true;

            setTimeout(() => {
                delete cooldown[enteredCommand];
            }, 60000);

            Twitch.botChatClient.say(settings.twitch.channelName, command.text);
        }
    }

    // MARK: static offline
    /**
     * Handles when the stream goes offline.
     * @returns {void}
     */
    static offline() {

    }

    // MARK: static raided
    /**
     * Handles when the stream is raided.
     * @param {TwitchListenerTypes.RaidedEvent} ev The raided event.
     * @returns {void}
     */
    static raided(ev) {
        if (ev.channel === settings.twitch.channelName) {
            Notifications.add("raided", ev, "alert");
            Twitch.botChatClient.say(settings.twitch.channelName, `Thanks for the raid, ${ev.name}!  Everyone, be sure to visit https://twitch.tv/${ev.user} to check out their stream!`);
        }
    }

    // MARK: static redemption
    /**
     * Handles when channel points are redeemed in the channel.
     * @param {TwitchListenerTypes.RedemptionEvent} ev The redemption event.
     * @returns {Promise} A promise that resolves when the redemption is completed.
     */
    static async redemption(ev) {
        let lighting = void 0;
        switch (ev.reward) {
            case "Color a box":
                if (colorABoxRegex.test(ev.message)) {
                    const {groups: {box, color}} = colorABoxRegex.exec(ev.message);
                    Lighting.data.lights.main.lights.set(+box, new Color(parseInt(color.substring(0, 2), 16), parseInt(color.substring(2, 4), 16), parseInt(color.substring(4, 6), 16)));
                    if (Lighting.data.currentLights === "main") {
                        await Lighting.data.lights.main.lights.illuminate();
                    }
                } else {
                    Twitch.botChatClient.say(settings.twitch.channelName, `Oops, looks like your bytes were spent for naught, ${ev.user}!`);
                }
                return;
            case "This is fine":
                lighting = "fire";
                break;
            case "VIP Badge":
                lighting = "alert";
                break;
        }
        Notifications.add("redemption", ev, lighting);
    }

    // MARK: static resub
    /**
     * Handles when a sub is renewed.
     * @param {TwitchListenerTypes.ResubEvent} ev The resub event.
     * @returns {void}
     */
    static resub(ev) {
        if (ev.channel === settings.twitch.channelName) {
            Notifications.add("resub", ev, "alert");
            Twitch.botChatClient.say(settings.twitch.channelName, `Thanks ${ev.name} for continuing to be a ${TwitchListener.getTierName(ev.tier, ev.isPrime)}!${ev.months && ev.months > 1 ? `  They have been subscribed for ${ev.months} months${ev.streak && ev.streak === ev.months ? " in a row!" : ""}${ev.streak && ev.streak > 1 && ev.streak !== ev.months ? ` and for ${ev.streak} months in a row!` : ""}!` : ""}`);
        }
    }

    // MARK: static ritual
    /**
     * Handles when a ritual occurs in chat.
     * @param {TwitchListenerTypes.RitualEvent} ev The ritual event.
     * @returns {void}
     */
    static ritual(ev) {
        if (ev.channel === settings.twitch.channelName) {
        }
    }

    // MARK: static stream
    /**
     * Handles when the stream goes live.
     * @param {TwitchListenerTypes.StreamEvent} ev The stream event.
     * @returns {void}
     */
    static stream(ev) {

    }

    // MARK: static sub
    /**
     * Handles a sub to the channel.
     * @param {TwitchListenerTypes.SubEvent} ev The sub event.
     * @returns {void}
     */
    static sub(ev) {
        if (ev.channel === settings.twitch.channelName) {
            Notifications.add("sub", ev, "alert");
            Twitch.botChatClient.say(settings.twitch.channelName, `Thanks ${ev.name} for becoming a ${TwitchListener.getTierName(ev.tier, ev.isPrime)}!${ev.months && ev.months > 1 ? `  They have been subscribed for ${ev.months} months${ev.streak && ev.streak === ev.months ? " in a row!" : ""}${ev.streak && ev.streak > 1 && ev.streak !== ev.months ? ` and for ${ev.streak} months in a row!` : ""}!` : ""}`);
        }
    }

    // MARK: static subExtend
    /**
     * Handles when a sub is extended via a sub token.
     * @param {TwitchListenerTypes.SubExtendEvent} ev The sub extend event.
     * @returns {void}
     */
    static subExtend(ev) {
        if (ev.channel === settings.twitch.channelName) {
            Notifications.add("subExtend", ev, "alert");
            Twitch.botChatClient.say(settings.twitch.channelName, `Thanks ${ev.name} for becoming a ${TwitchListener.getTierName(ev.tier, false)}!${ev.months && ev.months > 1 ? `  They have been subscribed for ${ev.months} months!` : ""}`);
        }
    }

    // MARK: static subGift
    /**
     * Handles when a sub is gifted to a user.
     * @param {TwitchListenerTypes.SubGiftEvent} ev The sub gift event.
     * @returns {void}
     */
    static subGift(ev) {
        if (ev.channel === settings.twitch.channelName) {
            Notifications.add("subGift", ev, "alert");
            Twitch.botChatClient.say(settings.twitch.channelName, `Thanks ${ev.gifterName} for making ${ev.name} a ${TwitchListener.getTierName(ev.tier, false)}!`);
        }
    }

    // MARK: static subGiftCommunity
    /**
     * Handles when subs are gifted to the community.
     * @param {TwitchListenerTypes.SubGiftCommunityEvent} ev The sub gift community event.
     * @returns {void}
     */
    static subGiftCommunity(ev) {
        if (ev.channel === settings.twitch.channelName) {
            Notifications.add("subGiftCommunity", ev, "alert");
            Twitch.botChatClient.say(settings.twitch.channelName, `Thanks ${ev.name} for making ${ev.giftCount} new ${TwitchListener.getTierName(ev.tier, false)}s!${ev.totalGiftCount && ev.giftCount !== ev.totalGiftCount ? `  They have gifted ${ev.totalGiftCount} total subscriptions in the channel!` : ""}`);
        }
    }

    // MARK: static subGiftCommunityPayForward
    /**
     * Handles when a sub gifted to the community was payed forward by the recipient.
     * @param {TwitchListenerTypes.SubGiftCommunityPayForwardEvent} ev The sub gift pay forward event.
     * @returns {void}
     */
    static subGiftCommunityPayForward(ev) {
        if (ev.channel === settings.twitch.channelName) {
            Notifications.add("subGiftCommunityPayForward", ev, "alert");
            Twitch.botChatClient.say(settings.twitch.channelName, `Thanks ${ev.name} for paying forward ${ev.originalGifter}'s gift subscription!`);
        }
    }

    // MARK: static subGiftPayForward
    /**
     * Handles when a sub gifted to a user was payed forward.
     * @param {TwitchListenerTypes.SubGiftPayForwardEvent} ev The sub pay forward event.
     * @returns {void}
     */
    static subGiftPayForward(ev) {
        if (ev.channel === settings.twitch.channelName) {
            Notifications.add("subGiftPayForward", ev, "alert");
            Twitch.botChatClient.say(settings.twitch.channelName, `Thanks ${ev.name} for paying forward ${ev.originalGifter}'s gift subscription to ${ev.recipient}!`);
        }
    }

    // MARK: static subGiftUpgrade
    /**
     * Handles when a gifted sub is upgraded to a regular sub.
     * @param {TwitchListenerTypes.SubGiftUpgradeEvent} ev The sub gift upgrade event.
     * @returns {void}
     */
    static subGiftUpgrade(ev) {
        if (ev.channel === settings.twitch.channelName) {
            Notifications.add("subGiftUpgrade", ev, "alert");
            Twitch.botChatClient.say(settings.twitch.channelName, `Thanks ${ev.name} for remaining a ${TwitchListener.getTierName(ev.tier, false)}, continuing the gift subscription from ${ev.gifter}!`);
        }
    }

    // MARK: static subPrimeUpgraded
    /**
     * Handles when a sub prime is upgraded to a regular sub.
     * @param {TwitchListenerTypes.SubPrimeUpgradedEvent} ev The sub prime upgraded event.
     * @returns {void}
     */
    static subPrimeUpgraded(ev) {
        if (ev.channel === settings.twitch.channelName) {
            Notifications.add("subPrimeUpgraded", ev, "alert");
            Twitch.botChatClient.say(settings.twitch.channelName, `Thanks ${ev.name} for upgrading their Prime subscription and becoming a full ${TwitchListener.getTierName(ev.tier, false)}!`);
        }
    }

    // MARK: static whisper
    /**
     * Handles when the bot is whispered.
     * @param {TwitchListenerTypes.WhisperEvent} ev The whisper event.
     * @returns {void}
     */
    static whisper(ev) {
    }
}

module.exports = TwitchListener;
