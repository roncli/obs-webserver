/**
 * @typedef {import("ws").Data} WebSocket.Data
 */

//  #   #         #                           #              #     #        #            #
//  #   #         #                           #              #     #                     #
//  #   #   ###   # ##    ###    ###    ###   #   #   ###   ####   #       ##     ###   ####    ###   # ##    ###   # ##
//  # # #  #   #  ##  #  #      #   #  #   #  #  #   #   #   #     #        #    #       #     #   #  ##  #  #   #  ##  #
//  # # #  #####  #   #   ###   #   #  #      ###    #####   #     #        #     ###    #     #####  #   #  #####  #
//  ## ##  #      ##  #      #  #   #  #   #  #  #   #       #  #  #        #        #   #  #  #      #   #  #      #
//  #   #   ###   # ##   ####    ###    ###   #   #   ###     ##   #####   ###   ####     ##    ###   #   #   ###   #
/**
 * A class that handles listening to Websocket events.
 */
class WebsocketListener {
    // # #    ##    ###    ###    ###   ###   ##
    // ####  # ##  ##     ##     #  #  #  #  # ##
    // #  #  ##      ##     ##   # ##   ##   ##
    // #  #   ##   ###    ###     # #  #      ##
    //                                  ###
    /**
     * Handles when a message is received by the websocket.
     * @param {object} data The message event.
     * @returns {void}
     */
    static message(data) {
        // TODO: Handle websocket.
        console.log("Incoming to server.", data);
    }
}

module.exports = WebsocketListener;
