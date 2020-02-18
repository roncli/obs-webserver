const twitch = require("../twitch");

//  #####           #     #            #
//    #                   #            #
//    #    #   #   ##    ####    ###   # ##
//    #    #   #    #     #     #   #  ##  #
//    #    # # #    #     #     #      #   #
//    #    # # #    #     #  #  #   #  #   #
//    #     # #    ###     ##    ###   #   #
/**
 * A class that communicates with the server for Twitch websocket connections.
 */
class Twitch {
    //  #           #     #
    //                    #
    // ##    ###   ##    ###
    //  #    #  #   #     #
    //  #    #  #   #     #
    // ###   #  #  ###     ##
    /**
     * Initializes the WebSocket by adding it to the clients array.
     * @returns {void}
     */
    static init() {
        Twitch.clients.push(this);
    }
}

Twitch.clients = [];

modules.export = Twitch;
