const Deferred = require("./deferred"),
    Queue = require("./queue"),
    Websocket = require("./websocket"),

    queue = new Queue();

let notificationReady = Deferred.promise(),
    notificationCooldown = Deferred.promise();

// Notification cooldown starts resolved.
notificationCooldown.resolve();

notificationReady.resolve();

//  #   #          #       #      ##     #                   #       #
//  #   #          #             #  #                        #
//  ##  #   ###   ####    ##     #      ##     ###    ###   ####    ##     ###   # ##    ###
//  # # #  #   #   #       #    ####     #    #   #      #   #       #    #   #  ##  #  #
//  #  ##  #   #   #       #     #       #    #       ####   #       #    #   #  #   #   ###
//  #   #  #   #   #  #    #     #       #    #   #  #   #   #  #    #    #   #  #   #      #
//  #   #   ###     ##    ###    #      ###    ###    ####    ##    ###    ###   #   #  ####
/**
 * A class that handles notifications for the stream.
 */
class Notifications {
    //          #     #
    //          #     #
    //  ###   ###   ###
    // #  #  #  #  #  #
    // # ##  #  #  #  #
    //  # #   ###   ###
    /**
     * Adds a notification to the queue.
     * @param {string} type The notification type.
     * @param {object} data The data of for notification.
     * @returns {void}
     */
    static add(type, data) {
        queue.push(() => {
            Notifications.send(type, data);
        });
    }

    //                       #
    //                       #
    //  ###    ##   ###    ###
    // ##     # ##  #  #  #  #
    //   ##   ##    #  #  #  #
    // ###     ##   #  #   ###
    /**
     * Sends a notification to the websocket when ready.
     * @param {string} type The type of notification.
     * @param {object} data The data to send.
     * @returns {Promise} A promise that resolves when the notification has been sent.
     */
    static async send(type, data) {
        await notificationReady;
        await notificationCooldown;

        notificationCooldown = Deferred.promise();
        setTimeout(() => {
            notificationCooldown.resolve();
        }, 10 * 1000);

        Websocket.broadcast({
            type: "notification",
            data: {type, data}
        });
    }

    //         #                 #
    //         #                 #
    //  ###   ###    ###  ###   ###
    // ##      #    #  #  #  #   #
    //   ##    #    # ##  #      #
    // ###      ##   # #  #       ##
    /**
     * Starts the processing of notifications.
     * @returns {void}
     */
    static start() {
        notificationReady.resolve();
    }

    //         #
    //         #
    //  ###   ###    ##   ###
    // ##      #    #  #  #  #
    //   ##    #    #  #  #  #
    // ###      ##   ##   ###
    //                    #
    /**
     * Stops the processing of notifications.
     * @returns {void}
     */
    static stop() {
        notificationReady = Deferred.promise();
    }
}

module.exports = Notifications;
