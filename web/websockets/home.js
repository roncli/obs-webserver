/**
 * @typedef {import("ws")} WebSocket
 * @typedef {import("ws").Data} WebSocket.Data
 */

const WS = require("../../src/websocket");

// MARK: class Home
/**
 * A websocket to handle connections to the home page.
 */
class Home {
    // MARK: static close
    /**
     * Close the websocket.
     * @param {WebSocket} ws The websocket.
     * @returns {void}
     */
    static close(ws) {
        WS.unregister(ws);
    }

    // MARK: static init
    /**
     * Initializes the websocket.
     * @param {WebSocket} ws The websocket.
     * @returns {void}
     */
    static init(ws) {
        WS.register(ws);
    }

    // MARK: static message
    /**
     * Handles receiving a message.
     * @param {WebSocket} ws The websocket.
     * @param {string} data The data.
     * @returns {void}
     */
    static message(ws, data) {
        WS.events.emit("message", JSON.parse(data));
    }
}

Home.route = {
    path: "/",
    webSocket: true
};

module.exports = Home;
