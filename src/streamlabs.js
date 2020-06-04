const StreamlabsWs = require("streamlabs-ws-client"),
    settings = require("../settings");

//   ###    #                                  ##           #
//  #   #   #                                   #           #
//  #      ####   # ##    ###    ###   ## #     #     ###   # ##    ###
//   ###    #     ##  #  #   #      #  # # #    #        #  ##  #  #
//      #   #     #      #####   ####  # # #    #     ####  #   #   ###
//  #   #   #  #  #      #      #   #  # # #    #    #   #  ##  #      #
//   ###     ##   #       ###    ####  #   #   ###    ####  # ##   ####
/**
 * A class that handles connection to Streamlabs.
 */
class Streamlabs {
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
        Streamlabs.client = new StreamlabsWs.StreamlabsClient(settings.streamlabs);

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

/** @type {StreamlabsWs.StreamlabsClient} */
Streamlabs.client = void 0;

module.exports = Streamlabs;
