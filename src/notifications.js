const Deferred = require("./deferred"),
    Lighting = require("./lighting"),
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
     * @param {string} [lighting] The optional lighting to use.
     * @returns {void}
     */
    static add(type, data, lighting) {
        queue.push(async () => {
            await Notifications.send(type, data, lighting);
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
     * @param {string} [lighting] The optional lighting to use.
     * @returns {Promise} A promise that resolves when the notification has been sent.
     */
    static async send(type, data, lighting) {
        const oldLighting = Lighting.data.currentLights;

        await notificationReady;
        await notificationCooldown;

        if (!notificationCooldown || !notificationCooldown.isPending()) {
            notificationCooldown = Deferred.promise();
        }
        setTimeout(() => {
            if (lighting && Lighting.data.currentLights === lighting) {
                Lighting.stopAnimation();
                Lighting.data.currentLights = oldLighting;
                Lighting.startAnimation();
            }
            notificationCooldown.resolve();
        }, 10 * 1000);

        Websocket.broadcast({
            type: "notification",
            data: {type, data}
        });

        if (lighting) {
            Lighting.stopAnimation();
            Lighting.data.currentLights = lighting;
            Lighting.startAnimation();
        }
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
