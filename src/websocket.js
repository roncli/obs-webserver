/**
 * @typedef {import("ws")} WebSocket
 */

const events = require("events");

/**
 * @type {WebSocket[]}
 */
const clients = [];

const eventEmitter = new events.EventEmitter();

//  #   #         #                           #              #
//  #   #         #                           #              #
//  #   #   ###   # ##    ###    ###    ###   #   #   ###   ####
//  # # #  #   #  ##  #  #      #   #  #   #  #  #   #   #   #
//  # # #  #####  #   #   ###   #   #  #      ###    #####   #
//  ## ##  #      ##  #      #  #   #  #   #  #  #   #       #  #
//  #   #   ###   # ##   ####    ###    ###   #   #   ###     ##
/**
 * A class used for communication via websockets.
 */
class Websocket {
    //                          #
    //                          #
    //  ##   # #    ##   ###   ###    ###
    // # ##  # #   # ##  #  #   #    ##
    // ##    # #   ##    #  #   #      ##
    //  ##    #     ##   #  #    ##  ###
    /**
     * Returns the EventEmitter for Websocket events.
     * @returns {events.EventEmitter} The EventEmitter object.
     */
    static get events() {
        return eventEmitter;
    }

    // #                          #                      #
    // #                          #                      #
    // ###   ###    ##    ###   ###   ##    ###   ###   ###
    // #  #  #  #  #  #  #  #  #  #  #     #  #  ##      #
    // #  #  #     #  #  # ##  #  #  #     # ##    ##    #
    // ###   #      ##    # #   ###   ##    # #  ###      ##
    /**
     * Broadcasts a message to qualifying connected websocket clients.
     * @param {object} message The message to send.
     * @returns {void}
     */
    static broadcast(message) {
        console.log("Outgoing to client.", message);

        const str = JSON.stringify(message);

        clients.forEach((client) => {
            if (client.readyState !== 1) {
                return;
            }

            client.send(str);
        });
    }

    //                    #            #
    //                                 #
    // ###    ##    ###  ##     ###   ###    ##   ###
    // #  #  # ##  #  #   #    ##      #    # ##  #  #
    // #     ##     ##    #      ##    #    ##    #
    // #      ##   #     ###   ###      ##   ##   #
    //              ###
    /**
     * Registers a websocket for broadcasting.
     * @param {WebSocket} ws The websocket to broadcast to.
     * @returns {void}
     */
    static register(ws) {
        clients.push(ws);
    }

    //                                #            #
    //                                             #
    // #  #  ###   ###    ##    ###  ##     ###   ###    ##   ###
    // #  #  #  #  #  #  # ##  #  #   #    ##      #    # ##  #  #
    // #  #  #  #  #     ##     ##    #      ##    #    ##    #
    //  ###  #  #  #      ##   #     ###   ###      ##   ##   #
    //                          ###
    /**
     * Unregisters a websocket from broadcasting.
     * @param {WebSocket} ws The websocket to stop broadcasting to.
     * @returns {void}
     */
    static unregister(ws) {
        clients.splice(clients.indexOf(ws), 1);
    }
}

module.exports = Websocket;
