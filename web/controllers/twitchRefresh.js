/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 */

const Common = require("../includes/common"),
    ConfigFile = require("../../src/configFile"),
    crypto = require("crypto"),
    OKView = require("../../public/views/200"),
    promisify = require("util").promisify,
    settings = require("../../settings");

//  #####           #     #            #      ####            ##                        #
//    #                   #            #      #   #          #  #                       #
//    #    #   #   ##    ####    ###   # ##   #   #   ###    #     # ##    ###    ###   # ##
//    #    #   #    #     #     #   #  ##  #  ####   #   #  ####   ##  #  #   #  #      ##  #
//    #    # # #    #     #     #      #   #  # #    #####   #     #      #####   ###   #   #
//    #    # # #    #     #  #  #   #  #   #  #  #   #       #     #      #          #  #   #
//    #     # #    ###     ##    ###   #   #  #   #   ###    #     #       ###   ####   #   #
/**
 * A class that handles the Twitch refresh page.
 */
class TwitchRefresh {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Processes the request.
     * @param {Express.Request} req The request.
     * @param {Express.Response} res The response.
     * @returns {Promise} A promise that resolves when the request has been processed.
     */
    static async get(req, res) {
        const state = (await promisify(crypto.randomBytes)(32)).toString("hex");

        await ConfigFile.set({
            twitchOAuthState: state
        });

        res.status(200).send(Common.page(
            "",
            {},
            OKView.get(/* html */`
                Select a token to refresh.  Note that you should already be logged into your Twitch account at twitch.tv on this browser for this to work.<br /><br />
                <a href="https://id.twitch.tv/oauth2/authorize?client_id=${settings.twitch.clientId}&redirect_uri=${settings.twitch.redirectUri}&response_type=code&scope=${settings.twitch.channelScopes.join(" ")}&state=${state}">roncli</a><br /><br />
                <a href="https://id.twitch.tv/oauth2/authorize?client_id=${settings.twitch.clientId}&redirect_uri=${settings.twitch.redirectUri}&response_type=code&scope=${settings.twitch.botScopes.join(" ")}&state=${state}">BotCli</a>
            `)
        ));
    }
}

TwitchRefresh.route = {
    path: "/twitch/refresh"
};

module.exports = TwitchRefresh;
