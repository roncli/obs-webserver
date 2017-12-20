//  #        #            #
//  #                     #
//  #       ##     ###   ####    ###   # ##
//  #        #    #       #     #   #  ##  #
//  #        #     ###    #     #####  #   #
//  #        #        #   #  #  #      #   #
//  #####   ###   ####     ##    ###   #   #
/**
 * A class that listens for WebSocket connections for broadcast purposes.
 */
class Listen {
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
        Listen.clients.push(this);
    }

    //       ##
    //        #
    //  ##    #     ##    ###    ##
    // #      #    #  #  ##     # ##
    // #      #    #  #    ##   ##
    //  ##   ###    ##   ###     ##
    /**
     * Removes a WebSocket from the clients array.
     * @returns {void}
     */
    static close() {
        Listen.clients.splice(Listen.clients.indexOf(this), 1);
    }
}

Listen.clients = [];

module.exports = Listen;
