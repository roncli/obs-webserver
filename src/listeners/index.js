const Streamlabs = require("../streamlabs"),
    StreamlabsListener = require("./streamlabs"),
    Twitch = require("../twitch"),
    TwitchListener = require("./twitch"),
    Websocket = require("../websocket"),
    WebsocketListener = require("./websocket");

// MARK: class Listeners
/**
 * A class that sets up listening to eventEmitters.
 */
class Listeners {
    // MARK: static setup
    /**
     * Sets up the listeners for Twitch and Websockets.
     * @returns {void}
     */
    static setup() {
        Streamlabs.start();

        Object.getOwnPropertyNames(StreamlabsListener).filter((property) => typeof StreamlabsListener[property] === "function").forEach((property) => {
            Streamlabs.client.on(property, StreamlabsListener[property]);
        });

        Object.getOwnPropertyNames(TwitchListener).filter((property) => typeof TwitchListener[property] === "function" && property !== "getTierName").forEach((property) => {
            Twitch.events.on(property, TwitchListener[property]);
        });

        Object.getOwnPropertyNames(WebsocketListener).filter((property) => typeof WebsocketListener[property] === "function").forEach((property) => {
            Websocket.events.on(property, WebsocketListener[property]);
        });
    }
}

module.exports = Listeners;
