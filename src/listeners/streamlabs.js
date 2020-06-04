/**
 * @typedef {import("../../types/streamlabsListenerTypes").DonationEvent} StreamlabsListenerTypes.DonationEvent
 */

const Notifications = require("../notifications"),
    Twitch = require("../twitch"),

    settings = require("../../settings");

//   ###    #                                  ##           #             #        #            #
//  #   #   #                                   #           #             #                     #
//  #      ####   # ##    ###    ###   ## #     #     ###   # ##    ###   #       ##     ###   ####    ###   # ##    ###   # ##
//   ###    #     ##  #  #   #      #  # # #    #        #  ##  #  #      #        #    #       #     #   #  ##  #  #   #  ##  #
//      #   #     #      #####   ####  # # #    #     ####  #   #   ###   #        #     ###    #     #####  #   #  #####  #
//  #   #   #  #  #      #      #   #  # # #    #    #   #  ##  #      #  #        #        #   #  #  #      #   #  #      #
//   ###     ##   #       ###    ####  #   #   ###    ####  # ##   ####   #####   ###   ####     ##    ###   #   #   ###   #
/**
 * A class that handles listening to Streamlabs events.
 */
class StreamlabsListener {
    //    #                     #     #
    //    #                     #
    //  ###   ##   ###    ###  ###   ##     ##   ###
    // #  #  #  #  #  #  #  #   #     #    #  #  #  #
    // #  #  #  #  #  #  # ##   #     #    #  #  #  #
    //  ###   ##   #  #   # #    ##  ###    ##   #  #
    /**
     * Handles a donation.
     * @param {StreamlabsListenerTypes.DonationEvent} data The donation data.
     * @returns {void}
     */
    static donation(data) {
        Notifications.add("donation", {
            from: data.name,
            formattedAmount: data.formatted_amount,
            amount: data.amount,
            currency: data.currency,
            message: data.message
        });
        Twitch.twitchChatClient.say(settings.twitch.channelName, `Thank you ${data.name} for your generous donation of ${data.formatted_amount}${!data.currency || data.currency.length === 0 || data.currency === "USD" ? "" : ` ${data.currency}`}!`);
    }
}

module.exports = StreamlabsListener;
