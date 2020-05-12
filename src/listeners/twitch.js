/**
 * @typedef {import("../../types/twitchListenerTypes").ActionEvent} TwitchListenerTypes.ActionEvent
 * @typedef {import("../../types/twitchListenerTypes").BitsEvent} TwitchListenerTypes.BitsEvent
 * @typedef {import("../../types/twitchListenerTypes").ErrorEvent} TwitchListenerTypes.ErrorEvent
 * @typedef {import("../../types/twitchListenerTypes").FollowEvent} TwitchListenerTypes.FollowEvent
 * @typedef {import("../../types/twitchListenerTypes").GiftPrimeEvent} TwitchListenerTypes.GiftPrimeEvent
 * @typedef {import("../../types/twitchListenerTypes").HostEvent} TwitchListenerTypes.HostEvent
 * @typedef {import("../../types/twitchListenerTypes").HostedEvent} TwitchListenerTypes.HostedEvent
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
 * @typedef {import("../../types/twitchListenerTypes").SubGiftPayForwardEvent} TwitchListenerTypes.SubGiftPayForwardEvent
 * @typedef {import("../../types/twitchListenerTypes").SubGiftUpgradeEvent} TwitchListenerTypes.SubGiftUpgradeEvent
 * @typedef {import("../../types/twitchListenerTypes").SubPayForwardEvent} TwitchListenerTypes.SubPayForwardEvent
 * @typedef {import("../../types/twitchListenerTypes").SubPrimeUpgradedEvent} TwitchListenerTypes.SubPrimeUpgradedEvent
 * @typedef {import("../../types/twitchListenerTypes").WhisperEvent} TwitchListenerTypes.WhisperEvent
 */

const Notifications = require("../notifications"),
    settings = require("../../settings");

//  #####           #     #            #      #        #            #
//    #                   #            #      #                     #
//    #    #   #   ##    ####    ###   # ##   #       ##     ###   ####    ###   # ##    ###   # ##
//    #    #   #    #     #     #   #  ##  #  #        #    #       #     #   #  ##  #  #   #  ##  #
//    #    # # #    #     #     #      #   #  #        #     ###    #     #####  #   #  #####  #
//    #    # # #    #     #  #  #   #  #   #  #        #        #   #  #  #      #   #  #      #
//    #     # #    ###     ##    ###   #   #  #####   ###   ####     ##    ###   #   #   ###   #
/**
 * A class that handles listening to Twitch events.
 */
class TwitchListener {
    //              #     #
    //              #
    //  ###   ##   ###   ##     ##   ###
    // #  #  #      #     #    #  #  #  #
    // # ##  #      #     #    #  #  #  #
    //  # #   ##     ##  ###    ##   #  #
    /**
     * Handles a chat action, ie: when the /me command is used.
     * @param {TwitchListenerTypes.ActionEvent} ev The action event.
     * @returns {void}
     */
    static action(ev) {

    }

    // #      #     #
    // #            #
    // ###   ##    ###    ###
    // #  #   #     #    ##
    // #  #   #     #      ##
    // ###   ###     ##  ###
    /**
     * Handles when bits are cheered in the channel.
     * @param {TwitchListenerTypes.BitsEvent} ev The bits event.
     * @returns {void}
     */
    static bits(ev) {
        Notifications.add("bits", ev);
    }

    //  ##   ###   ###    ##   ###
    // # ##  #  #  #  #  #  #  #  #
    // ##    #     #     #  #  #
    //  ##   #     #      ##   #
    /**
     * Handles an error thrown from Twitch.
     * @param {TwitchListenerTypes.ErrorEvent} ev The error event.
     * @returns {void}
     */
    static error(ev) {

    }

    //   #         ##    ##
    //  # #         #     #
    //  #     ##    #     #     ##   #  #
    // ###   #  #   #     #    #  #  #  #
    //  #    #  #   #     #    #  #  ####
    //  #     ##   ###   ###    ##   ####
    /**
     * Handles when the channel is followed.
     * @param {TwitchListenerTypes.FollowEvent} ev The follow event.
     * @returns {void}
     */
    static follow(ev) {
        Notifications.add("follow", ev);
    }

    //        #      #    #    ###          #
    //              # #   #    #  #
    //  ###  ##     #    ###   #  #  ###   ##    # #    ##
    // #  #   #    ###    #    ###   #  #   #    ####  # ##
    //  ##    #     #     #    #     #      #    #  #  ##
    // #     ###    #      ##  #     #     ###   #  #   ##
    //  ###
    /**
     * Handles when a Prime gift is given.
     * @param {TwitchListenerTypes.GiftPrimeEvent} ev The gift prime event.
     * @returns {void}
     */
    static giftPrime(ev) {
        Notifications.add("giftPrime", ev);
    }

    // #                   #
    // #                   #
    // ###    ##    ###   ###
    // #  #  #  #  ##      #
    // #  #  #  #    ##    #
    // #  #   ##   ###      ##
    /**
     * Handles when a channel gets hosted.
     * @param {TwitchListenerTypes.HostEvent} ev The host event.
     * @returns {void}
     */
    static host(ev) {

    }

    // #                   #             #
    // #                   #             #
    // ###    ##    ###   ###    ##    ###
    // #  #  #  #  ##      #    # ##  #  #
    // #  #  #  #    ##    #    ##    #  #
    // #  #   ##   ###      ##   ##    ###
    /**
     * Handles when the channel is hosted.
     * @param {TwitchListenerTypes.HostedEvent} ev The hosted event.
     * @returns {void}
     */
    static hosted(ev) {
        if (ev.channel === settings.twitch.channelName) {
            Notifications.add("hosted", ev);
        }
    }

    // # #    ##    ###    ###    ###   ###   ##
    // ####  # ##  ##     ##     #  #  #  #  # ##
    // #  #  ##      ##     ##   # ##   ##   ##
    // #  #   ##   ###    ###     # #  #      ##
    //                                  ###
    /**
     * Handles when a message is posted in chat.
     * @param {TwitchListenerTypes.MessageEvent} ev The message event.
     * @returns {void}
     */
    static message(ev) {

    }

    //         #     #   ##     #
    //        # #   # #   #
    //  ##    #     #     #    ##    ###    ##
    // #  #  ###   ###    #     #    #  #  # ##
    // #  #   #     #     #     #    #  #  ##
    //  ##    #     #    ###   ###   #  #   ##
    /**
     * Handles when the stream goes offline.
     * @returns {void}
     */
    static offline() {

    }

    //              #       #           #
    //                      #           #
    // ###    ###  ##     ###   ##    ###
    // #  #  #  #   #    #  #  # ##  #  #
    // #     # ##   #    #  #  ##    #  #
    // #      # #  ###    ###   ##    ###
    /**
     * Handles when the stream is raided.
     * @param {TwitchListenerTypes.RaidedEvent} ev The raided event.
     * @returns {void}
     */
    static raided(ev) {
        if (ev.channel === settings.twitch.channelName) {
            Notifications.add("hosted", ev);
        }
    }

    //                #                     #     #
    //                #                     #
    // ###    ##    ###   ##   # #   ###   ###   ##     ##   ###
    // #  #  # ##  #  #  # ##  ####  #  #   #     #    #  #  #  #
    // #     ##    #  #  ##    #  #  #  #   #     #    #  #  #  #
    // #      ##    ###   ##   #  #  ###     ##  ###    ##   #  #
    //                               #
    /**
     * Handles when channel points are redeemed in the channel.
     * @param {TwitchListenerTypes.RedemptionEvent} ev The redemption event.
     * @returns {void}
     */
    static redemption(ev) {
        Notifications.add("redemption", ev);
    }

    //                          #
    //                          #
    // ###    ##    ###   #  #  ###
    // #  #  # ##  ##     #  #  #  #
    // #     ##      ##   #  #  #  #
    // #      ##   ###     ###  ###
    /**
     * Handles when a sub is renewed.
     * @param {TwitchListenerTypes.ResubEvent} ev The resub event.
     * @returns {void}
     */
    static resub(ev) {
        Notifications.add("resub", ev);
    }

    //        #     #                ##
    //              #                 #
    // ###   ##    ###   #  #   ###   #
    // #  #   #     #    #  #  #  #   #
    // #      #     #    #  #  # ##   #
    // #     ###     ##   ###   # #  ###
    /**
     * Handles when a ritual occurs in chat.
     * @param {TwitchListenerTypes.RitualEvent} ev The ritual event.
     * @returns {void}
     */
    static ritual(ev) {

    }

    //         #
    //         #
    //  ###   ###   ###    ##    ###  # #
    // ##      #    #  #  # ##  #  #  ####
    //   ##    #    #     ##    # ##  #  #
    // ###      ##  #      ##    # #  #  #
    /**
     * Handles when the stream goes live.
     * @param {TwitchListenerTypes.StreamEvent} ev The stream event.
     * @returns {void}
     */
    static stream(ev) {

    }

    //              #
    //              #
    //  ###   #  #  ###
    // ##     #  #  #  #
    //   ##   #  #  #  #
    // ###     ###  ###
    /**
     * Handles a sub to the channel.
     * @param {TwitchListenerTypes.SubEvent} ev The sub event.
     * @returns {void}
     */
    static sub(ev) {
        Notifications.add("sub", ev);
    }

    //              #     ####         #                   #
    //              #     #            #                   #
    //  ###   #  #  ###   ###   #  #  ###    ##   ###    ###
    // ##     #  #  #  #  #      ##    #    # ##  #  #  #  #
    //   ##   #  #  #  #  #      ##    #    ##    #  #  #  #
    // ###     ###  ###   ####  #  #    ##   ##   #  #   ###
    /**
     * Handles when a sub is extended via a sub token.
     * @param {TwitchListenerTypes.SubExtendEvent} ev The sub extend event.
     * @returns {void}
     */
    static subExtend(ev) {
        Notifications.add("subExtend", ev);
    }

    //              #      ##    #      #    #
    //              #     #  #         # #   #
    //  ###   #  #  ###   #     ##     #    ###
    // ##     #  #  #  #  # ##   #    ###    #
    //   ##   #  #  #  #  #  #   #     #     #
    // ###     ###  ###    ###  ###    #      ##
    /**
     * Handles when a sub is gifted to a user.
     * @param {TwitchListenerTypes.SubGiftEvent} ev The sub gift event.
     * @returns {void}
     */
    static subGift(ev) {
        Notifications.add("subGift", ev);
    }

    //              #      ##    #      #    #     ##                                  #     #
    //              #     #  #         # #   #    #  #                                       #
    //  ###   #  #  ###   #     ##     #    ###   #      ##   # #   # #   #  #  ###   ##    ###   #  #
    // ##     #  #  #  #  # ##   #    ###    #    #     #  #  ####  ####  #  #  #  #   #     #    #  #
    //   ##   #  #  #  #  #  #   #     #     #    #  #  #  #  #  #  #  #  #  #  #  #   #     #     # #
    // ###     ###  ###    ###  ###    #      ##   ##    ##   #  #  #  #   ###  #  #  ###     ##    #
    //                                                                                             #
    /**
     * Handles when subs are gifted to the community.
     * @param {TwitchListenerTypes.SubGiftCommunityEvent} ev The sub gift community event.
     * @returns {void}
     */
    static subGiftCommunity(ev) {
        Notifications.add("subGiftCommunity", ev);
    }

    //              #      ##    #      #    #    ###               ####                                   #
    //              #     #  #         # #   #    #  #              #                                      #
    //  ###   #  #  ###   #     ##     #    ###   #  #   ###  #  #  ###    ##   ###   #  #   ###  ###    ###
    // ##     #  #  #  #  # ##   #    ###    #    ###   #  #  #  #  #     #  #  #  #  #  #  #  #  #  #  #  #
    //   ##   #  #  #  #  #  #   #     #     #    #     # ##   # #  #     #  #  #     ####  # ##  #     #  #
    // ###     ###  ###    ###  ###    #      ##  #      # #    #   #      ##   #     ####   # #  #      ###
    //                                                         #
    /**
     * Handles when a sub gifted to the community was payed forward by the recipient.
     * @param {TwitchListenerTypes.SubGiftPayForwardEvent} ev The sub gift pay forward event.
     * @returns {void}
     */
    static subGiftPayForward(ev) {
        Notifications.add("subGiftPayForward", ev);
    }

    //              #      ##    #      #    #    #  #                             #
    //              #     #  #         # #   #    #  #                             #
    //  ###   #  #  ###   #     ##     #    ###   #  #  ###    ###  ###    ###   ###   ##
    // ##     #  #  #  #  # ##   #    ###    #    #  #  #  #  #  #  #  #  #  #  #  #  # ##
    //   ##   #  #  #  #  #  #   #     #     #    #  #  #  #   ##   #     # ##  #  #  ##
    // ###     ###  ###    ###  ###    #      ##   ##   ###   #     #      # #   ###   ##
    //                                                  #      ###
    /**
     * Handles when a gifted sub is upgraded to a regular sub.
     * @param {TwitchListenerTypes.SubGiftUpgradeEvent} ev The sub gift upgrade event.
     * @returns {void}
     */
    static subGiftUpgrade(ev) {
        Notifications.add("subGiftUpgrade", ev);
    }

    //              #     ###               ####                                   #
    //              #     #  #              #                                      #
    //  ###   #  #  ###   #  #   ###  #  #  ###    ##   ###   #  #   ###  ###    ###
    // ##     #  #  #  #  ###   #  #  #  #  #     #  #  #  #  #  #  #  #  #  #  #  #
    //   ##   #  #  #  #  #     # ##   # #  #     #  #  #     ####  # ##  #     #  #
    // ###     ###  ###   #      # #    #   #      ##   #     ####   # #  #      ###
    //                                 #
    /**
     * Handles when a sub gifted to a user was payed forward.
     * @param {TwitchListenerTypes.SubPayForwardEvent} ev The sub pay forward event.
     * @returns {void}
     */
    static subPayForward(ev) {
        Notifications.add("subPayForward", ev);
    }

    //              #     ###          #                #  #                             #           #
    //              #     #  #                          #  #                             #           #
    //  ###   #  #  ###   #  #  ###   ##    # #    ##   #  #  ###    ###  ###    ###   ###   ##    ###
    // ##     #  #  #  #  ###   #  #   #    ####  # ##  #  #  #  #  #  #  #  #  #  #  #  #  # ##  #  #
    //   ##   #  #  #  #  #     #      #    #  #  ##    #  #  #  #   ##   #     # ##  #  #  ##    #  #
    // ###     ###  ###   #     #     ###   #  #   ##    ##   ###   #     #      # #   ###   ##    ###
    //                                                        #      ###
    /**
     * Handles when a sub prime is upgraded to a regular sub.
     * @param {TwitchListenerTypes.SubPrimeUpgradedEvent} ev The sub prime upgraded event.
     * @returns {void}
     */
    static subPrimeUpgraded(ev) {
        Notifications.add("subPrimeUpgraded", ev);
    }

    //       #      #
    //       #
    // #  #  ###   ##     ###   ###    ##   ###
    // #  #  #  #   #    ##     #  #  # ##  #  #
    // ####  #  #   #      ##   #  #  ##    #
    // ####  #  #  ###   ###    ###    ##   #
    //                          #
    /**
     * Handles when the bot is whispered.
     * @param {TwitchListenerTypes.WhisperEvent} ev The whisper event.
     * @returns {void}
     */
    static whisper(ev) {

    }
}

module.exports = TwitchListener;
