/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 */

const ConfigFile = require("../../src/configFile"),
    Common = require("../includes/common"),
    ControlView = require("../../public/views/control"),
    ServerErrorView = require("../../public/views/500"),
    Twitch = require("../../src/twitch");

//   ###                  #                    ##
//  #   #                 #                     #
//  #       ###   # ##   ####   # ##    ###     #
//  #      #   #  ##  #   #     ##  #  #   #    #
//  #      #   #  #   #   #     #      #   #    #
//  #   #  #   #  #   #   #  #  #      #   #    #
//   ###    ###   #   #    ##   #       ###    ###
/**
 * A class that handles the control page.
 */
class Control {
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
        if (!await Twitch.connect()) {
            res.status(500).send(Common.page(
                "",
                {css: ["/css/error.css"]},
                ServerErrorView.get(true, "Twitch tokens are invalid.")
            ));
            return;
        }

        res.status(200).send(Common.page(
            "",
            {css: ["/css/control.css"], js: ["/js/control.js"]},
            ControlView.get({
                discordChannels: ConfigFile.get("discordChannels") || [],
                spotifyPlaylists: ConfigFile.get("spotifyPlaylists") || [],
                actions: ConfigFile.get("actions") || []
            })
        ));
    }
}

Control.route = {
    path: "/control"
};

module.exports = Control;
