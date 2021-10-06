/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 */

const Common = require("../includes/common"),
    ConfigFile = require("../../src/configFile"),
    OKView = require("../../public/views/200"),
    request = require("@root/request"),
    ServerErrorView = require("../../public/views/500"),
    settings = require("../../settings"),
    Twitch = require("../../src/twitch"),
    util = require("util");

//  #####           #     #            #       ###     #            #     #
//    #                   #            #      #   #   # #           #     #
//    #    #   #   ##    ####    ###   # ##   #   #  #   #  #   #  ####   # ##
//    #    #   #    #     #     #   #  ##  #  #   #  #   #  #   #   #     ##  #
//    #    # # #    #     #     #      #   #  #   #  #####  #   #   #     #   #
//    #    # # #    #     #  #  #   #  #   #  #   #  #   #  #  ##   #  #  #   #
//    #     # #    ###     ##    ###   #   #   ###   #   #   ## #    ##   #   #
/**
 * A class that handles the Twitch OAuth response.
 */
class TwitchOAuth {
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
        const code = req.query.code,
            state = req.query.state;

        if (state !== await ConfigFile.get("twitchOAuthState")) {
            res.status(500).send(Common.page(
                "",
                {css: ["/css/error.css"]},
                ServerErrorView.get(false, "States don't match.  Try again.")
            ));
            return;
        }

        let response;
        try {
            response = await request.post({
                uri: `https://id.twitch.tv/oauth2/token?client_id=${settings.twitch.clientId}&client_secret=${settings.twitch.clientSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${settings.twitch.redirectUri}`,
                json: true
            });
        } catch (err) {
            res.status(500).send(Common.page(
                "",
                {css: ["/css/error.css"]},
                ServerErrorView.get(false, /* html */`
                    Error from Twitch.<br /><br />${util.inspect(err, {depth: Infinity, breakLength: Infinity, maxStringLength: Infinity, maxArrayLength: Infinity}).replace(/\r\n/g, "\r").replace(/[\r\n]/g, "<br />")}
                `)
            ));
            return;
        }

        if (response.statusCode !== 200) {
            res.status(500).send(Common.page(
                "",
                {css: ["/css/error.css"]},
                ServerErrorView.get(false, /* html */`
                    Invalid response from Twitch.<br /><br />${util.inspect(response, {depth: Infinity, breakLength: Infinity, maxStringLength: Infinity, maxArrayLength: Infinity}).replace(/\r\n/g, "\r").replace(/[\r\n]/g, "<br />")}
                `)
            ));
            return;
        }

        const accessToken = response.body.access_token,
            refreshToken = response.body.refresh_token,
            scope = response.body.scope;

        if (scope.filter((s) => settings.twitch.channelScopes.indexOf(s) === -1).length === 0 && settings.twitch.channelScopes.filter((s) => scope.indexOf(s) === -1).length === 0) {
            await ConfigFile.set({
                channelAccessToken: accessToken,
                channelRefreshToken: refreshToken
            });
        } else if (scope.filter((s) => settings.twitch.botScopes.indexOf(s) === -1).length === 0 && settings.twitch.botScopes.filter((s) => scope.indexOf(s) === -1).length === 0) {
            await ConfigFile.set({
                botAccessToken: accessToken,
                botRefreshToken: refreshToken
            });
        } else {
            res.status(500).send(Common.page(
                "",
                {css: ["/css/error.css"]},
                ServerErrorView.get(false, /* html */`
                    Could not determine the tokens to replace.<br /><br />${util.inspect(response.body, {depth: Infinity, breakLength: Infinity, maxStringLength: Infinity, maxArrayLength: Infinity}).replace(/\r\n/g, "\r").replace(/[\r\n]/g, "<br />")}
                `)
            ));
            return;
        }

        try {
            await Twitch.logout();
            await Twitch.connect();
            await Twitch.login();
        } catch (err) {
            res.status(500).send(Common.page(
                "",
                {css: ["/css/error.css"]},
                ServerErrorView.get(false, /* html */`
                    Error logging in.<br /><br />${util.inspect(err, {depth: Infinity, breakLength: Infinity, maxStringLength: Infinity, maxArrayLength: Infinity}).replace(/\r\n/g, "\r").replace(/[\r\n]/g, "<br />")}
                `)
            ));
            return;
        }

        res.status(200).send(Common.page(
            "",
            {},
            OKView.get("Twitch OAuth complete.")
        ));
    }
}

TwitchOAuth.route = {
    path: "/twitch/oauth"
};

module.exports = TwitchOAuth;
