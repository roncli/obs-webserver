const Common = require("../includes/common"),
    ServerErrorView = require("../../public/views/500"),
    Twitch = require("../../src/twitch");

/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 */

//   ###     #            #     #
//  #   #   # #           #     #
//  #   #  #   #  #   #  ####   # ##
//  #   #  #   #  #   #   #     ##  #
//  #   #  #####  #   #   #     #   #
//  #   #  #   #  #  ##   #  #  #   #
//   ###   #   #   ## #    ##   #   #
/**
 * A class that handles the Twitch OAuth flow.
 */
class OAuth {
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
        const code = /** @type {string} */(req.query.code); // eslint-disable-line no-extra-parens

        try {
            await Twitch.getAccessToken(code);
        } catch (err) {
            console.log(err);
            res.status(500).send(Common.page(
                "",
                {css: ["/css/error.css"]},
                ServerErrorView.get()
            ));
        }

        res.redirect("/control");
    }
}

OAuth.route = {
    path: "/oauth"
};

module.exports = OAuth;
