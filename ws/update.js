const fs = require("fs"),
    path = require("path"),
    {promisify} = require("util"),
    Listen = require("./listen");

//  #   #             #          #
//  #   #             #          #
//  #   #  # ##    ## #   ###   ####    ###
//  #   #  ##  #  #  ##      #   #     #   #
//  #   #  ##  #  #   #   ####   #     #####
//  #   #  # ##   #  ##  #   #   #  #  #
//   ###   #       ## #   ####    ##    ###
//         #
//         #
/**
 * A class that echoes WebSocket messages to listeners.
 */
class Update {
    //  #           #     #
    //                    #
    // ##    ###   ##    ###
    //  #    #  #   #     #
    //  #    #  #   #     #
    // ###   #  #  ###     ##
    /**
     * Sends initial settings to the client.
     * @returns {void}
     */
    static init() {
        const ws = this;

        promisify(fs.readFile)(path.join(__dirname, "../settings/scenes.json"), "utf8").then((data) => {
            ws.send(JSON.stringify({
                type: "scenes",
                data: JSON.parse(data)
            }));
        }).catch((err) => {
            console.log(err);
        });
    }

    // # #    ##    ###    ###    ###   ###   ##
    // ####  # ##  ##     ##     #  #  #  #  # ##
    // #  #  ##      ##     ##   # ##   ##   ##
    // #  #   ##   ###    ###     # #  #      ##
    //                                  ###
    /**
     * Echoes a message it to the listeners.
     * @param {string} data The data to echo.
     * @returns {void}
     */
    static message(data) {
        Listen.clients.forEach((ws) => {
            if (ws.readyState === ws.OPEN) {
                ws.send(data);
            }
        });
    }
}

module.exports = Update;
