/**
 * @typedef {import("../../types/streamlabsListenerTypes").DonationEvent} StreamlabsListenerTypes.DonationEvent
 */

const Notifications = require("../notifications"),
    Twitch = require("../twitch"),

    settings = require("../../settings"),

    idTable = new Set();

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
    //                          #
    //                          #
    //  ##   # #    ##   ###   ###
    // # ##  # #   # ##  #  #   #
    // ##    # #   ##    #  #   #
    //  ##    #     ##   #  #    ##
    /**
     * Handles an event.
     * @param {any} data The event data.
     * @returns {void}
     */
    static event(data) {
        if (!data.message || !Array.isArray(data.message)) {
            return;
        }

        for (const message of data.message) {
            // Avoid duplicate messages.
            if (idTable.has(message._id)) {
                return;
            }

            idTable.add(message._id);
            setTimeout(() => {
                idTable.delete(message._id);
            }, 3600000);

            switch (data.type) {
                case "follow":
                    Notifications.add("follow", {
                        userId: message.id,
                        user: message.name,
                        name: message.name,
                        date: message.created_at
                    });
                    Twitch.botChatClient.say(settings.twitch.channelName, `Thank you for following roncli Gaming, ${message.name}!`);
                    break;
                case "donation":
                    Notifications.add("donation", {
                        from: message.name,
                        formattedAmount: message.formatted_amount,
                        amount: message.amount,
                        currency: message.currency,
                        message: message.message
                    });
                    Twitch.botChatClient.say(settings.twitch.channelName, `Thank you ${message.name} for your generous donation of ${message.formatted_amount}${!message.currency || message.currency.length === 0 || message.currency === "USD" ? "" : ` ${message.currency}`}!`);
                    break;
            }
        }
    }
}

module.exports = StreamlabsListener;
