/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 * @typedef {{[x: string]: string}} Settings
 */

const ConfigFile = require("../../src/configFile"),
    Websocket = require("../../src/websocket");

//   ###                   ##     #             #             #
//  #   #                 #  #                 # #
//  #       ###   # ##    #      ##     ## #  #   #  # ##    ##
//  #      #   #  ##  #  ####     #    #  #   #   #  ##  #    #
//  #      #   #  #   #   #       #     ##    #####  ##  #    #
//  #   #  #   #  #   #   #       #    #      #   #  # ##     #
//   ###    ###   #   #   #      ###    ###   #   #  #       ###
//                                     #   #         #
//                                      ###          #
/**
 * A class that represents the Config API.
 */
class ConfigApi {
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
     * @returns {void}
     */
    static get(req, res) {
        res.json({data: ConfigFile.get(req.params.key) || []});
    }

    //                        #
    //                        #
    //  # ##    ###    ###   ####
    //  ##  #  #   #  #       #
    //  ##  #  #   #   ###    #
    //  # ##   #   #      #   #  #
    //  #       ###   ####     ##
    //  #
    //  #
    /**
     * Processes the request.
     * @param {Express.Request} req The request.
     * @param {Express.Response} res The response.
     * @returns {void}
     */
    static post(req, res) {
        /** @type {Settings} */
        const obj = {};

        obj[req.params.key] = req.body;

        ConfigFile.set(obj);

        Websocket.broadcast({
            type: "settings",
            data: {
                type: req.params.key,
                data: req.body
            }
        });

        res.sendStatus(204);
    }
}

ConfigApi.route = {
    path: "/api/config/:key"
};

module.exports = ConfigApi;
