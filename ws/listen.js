const request = require("request"),
    {promisify} = require("util"),
    config = require("../config"),
    PubSubClient = require("twitch-pubsub-client");

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

setTimeout(async() => {
    const response = await promisify(request)(`https://twitchtokengenerator.com/api/refresh/${config.twitch.refreshToken}`);
    this.accessToken = JSON.parse(response.body).token;

    this.pubSubClient = new PubSubClient.BasicPubSubClient();
    this.pubSubClient.connect();
    this.pubSubClient.onMessage((topic, message) => {
        const redemption = message.data.redemption,
            user = redemption.user.display_name,
            reward = redemption.reward.title,
            input = redemption.user_input;

        switch (reward) {
            case "This is fine":
                Listen.clients.forEach((ws) => {
                    ws.send(JSON.stringify({
                        type: "action",
                        action: "fire"
                    }));
                });
                break;
            case "Noita: Eh, Steve!":
                Listen.clients.forEach((ws) => {
                    ws.send(JSON.stringify({
                        type: "action",
                        action: "steve"
                    }));
                });
                break;
        }
    });

    this.pubSubClient.listen("channel-points-channel-v1.39676411", this.accessToken);
}, 0);

module.exports = Listen;
