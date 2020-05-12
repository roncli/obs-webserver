const Twitch = require("../twitch"),
    TwitchListener = require("./twitch"),
    Websocket = require("../websocket"),
    WebsocketListener = require("./websocket");

//  #        #            #
//  #                     #
//  #       ##     ###   ####    ###   # ##    ###   # ##    ###
//  #        #    #       #     #   #  ##  #  #   #  ##  #  #
//  #        #     ###    #     #####  #   #  #####  #       ###
//  #        #        #   #  #  #      #   #  #      #          #
//  #####   ###   ####     ##    ###   #   #   ###   #      ####
/**
 * A class that sets up listening to eventEmitters.
 */
class Listeners {
    //               #
    //               #
    //  ###    ##   ###   #  #  ###
    // ##     # ##   #    #  #  #  #
    //   ##   ##     #    #  #  #  #
    // ###     ##     ##   ###  ###
    //                          #
    /**
     * Sets up the listeners for Twitch and Websockets.
     * @returns {void}
     */
    static setup() {
        Object.getOwnPropertyNames(TwitchListener).filter((property) => typeof TwitchListener[property] === "function").forEach((property) => {
            Twitch.events.on(property, TwitchListener[property]);
        });

        Object.getOwnPropertyNames(WebsocketListener).filter((property) => typeof WebsocketListener[property] === "function").forEach((property) => {
            Websocket.events.on(property, WebsocketListener[property]);
        });
    }
}

module.exports = Listeners;
