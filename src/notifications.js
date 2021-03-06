const Deferred = require("./deferred"),
    Queue = require("./queue"),
    Websocket = require("./websocket");

let queue = new Queue(),
    notificationReady = Deferred.promise(),
    notificationCooldown = Deferred.promise();

// Notification cooldown starts resolved.
notificationCooldown.resolve();

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
        console.log(`Received notification ${type}.`);
        queue.push(async () => {
            console.log(`Awaiting notification ${type}.`);
            await Notifications.send(type, data);
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
        console.log("Notification system is ready.");
        await notificationCooldown;
        console.log("Notification cooldown is ready.");

        if (!notificationCooldown || !notificationCooldown.isPending()) {
            notificationCooldown = Deferred.promise();
        }
        setTimeout(() => {
            notificationCooldown.resolve();
            console.log("Notification cooldown is complete.");
        }, 10 * 1000);

        console.log(`Sending notification ${type}.`);
        Websocket.broadcast({
            type: "notification",
            data: {type, data}
        });
        console.log("Notificaiton cooldown is beginning.");
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
        console.log("Starting notification system.");
        notificationReady.resolve();
        notificationCooldown.resolve();
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
        console.log("Stopping notification system.");
        if (!notificationReady || !notificationReady.isPending()) {
            notificationReady = Deferred.promise();
        }
    }

    //                           #
    //                           #
    // ###    ##    ###    ##   ###
    // #  #  # ##  ##     # ##   #
    // #     ##      ##   ##     #
    // #      ##   ###     ##     ##
    /**
     * Resets the notification system.
     * @returns {void}
     */
    static reset() {
        console.log("Resetting notification system.");

        // Flush current notifications.
        Notifications.start();

        // Reset queue and notification triggers.
        queue = new Queue();
        if (!notificationReady || !notificationReady.isPending()) {
            notificationReady = Deferred.promise();
        }
        if (!notificationCooldown || !notificationCooldown.isPending()) {
            notificationCooldown = Deferred.promise();
        }

        // Notification cooldown starts resolved.
        notificationCooldown.resolve();
    }
}

module.exports = Notifications;
