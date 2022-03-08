/** @typedef {import("socket.io-client")} SocketIOClient */

const io = require("socket.io-client"),
    settings = require("../settings");

/** @type {SocketIOClient.Socket} */
let client = void 0;

//   ###    #                                  ##           #
//  #   #   #                                   #           #
//  #      ####   # ##    ###    ###   ## #     #     ###   # ##    ###
//   ###    #     ##  #  #   #      #  # # #    #        #  ##  #  #
//      #   #     #      #####   ####  # # #    #     ####  #   #   ###
//  #   #   #  #  #      #      #   #  # # #    #    #   #  ##  #      #
//   ###     ##   #       ###    ####  #   #   ###    ####  # ##   ####
/**
 * A class that handles connection to Streamlabs.
 *
 * @static
 */
class Streamlabs {
    //       ##     #                 #
    //        #                       #
    //  ##    #    ##     ##   ###   ###
    // #      #     #    # ##  #  #   #
    // #      #     #    ##    #  #   #
    //  ##   ###   ###    ##   #  #    ##
    /**
     * The Streamlabs client.
     * @returns {SocketIOClient.Socket} The Streamlabs client.
     */
    static get client() {
        return client;
    }

    //         #                 #
    //         #                 #
    //  ###   ###    ###  ###   ###
    // ##      #    #  #  #  #   #
    //   ##    #    # ##  #      #
    // ###      ##   # #  #       ##
    /**
     * Starts listening to Streamlabs.
     * @returns {void}
     */
    static start() {
        client = io(`https://sockets.streamlabs.com/?token=${settings.streamlabs.token}`);

        Streamlabs.client.on("connect_error", (ev) => {
            console.log("Streamlabs connect error:", ev);
            setTimeout(() => {
                Streamlabs.client.connect();
            }, 60000);
        });

        Streamlabs.client.on("connect_timeout", (ev) => {
            console.log("Streamlabs connect timeout:", ev);
            setTimeout(() => {
                Streamlabs.client.connect();
            }, 60000);
        });

        Streamlabs.client.on("disconnect", (ev) => {
            console.log("Streamlabs disconnected:", ev);
            setTimeout(() => {
                Streamlabs.client.connect();
            }, 60000);
        });

        Streamlabs.client.on("error", (ev) => {
            console.log("Streamlabs error:", ev, ev.message);
        });

        Streamlabs.client.connect();
    }
}

module.exports = Streamlabs;
