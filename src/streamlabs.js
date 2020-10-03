/**
 * @typedef {import("streamlabs-ws-client").StreamlabsClient} StreamlabsWs.StreamlabsClient
 */

const StreamlabsWs = require("streamlabs-ws-client"),
    settings = require("../settings");

/** @type {StreamlabsWs.StreamlabsClient} */
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
     * @returns {StreamlabsWs.StreamlabsClient} The Streamlabs client.
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
        client = new StreamlabsWs.StreamlabsClient(settings.streamlabs);

        Streamlabs.client.on("connect_error", (ev) => {
            console.log("connect_error", ev);
            setTimeout(() => {
                Streamlabs.client.connect();
            }, 60000);
        });

        Streamlabs.client.on("connect_timeout", (ev) => {
            console.log("connect_timeout", ev);
            setTimeout(() => {
                Streamlabs.client.connect();
            }, 60000);
        });

        Streamlabs.client.on("disconnect", (ev) => {
            console.log("disconnect", ev);
            setTimeout(() => {
                Streamlabs.client.connect();
            }, 60000);
        });

        Streamlabs.client.on("error", (ev) => {
            if (ev.message.indexOf("event.message must be an array") !== -1) {
                // Common error, return.
                return;
            }
            console.log("error", ev, ev.message);
        });

        Streamlabs.client.connect();
    }
}

module.exports = Streamlabs;
