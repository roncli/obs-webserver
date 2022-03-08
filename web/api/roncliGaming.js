/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 * @typedef {{[x: string]: any}} Settings
 */

const ConfigFile = require("../../src/configFile"),
    Websocket = require("../../src/websocket");

//  ####                         ##      #     ###                   #                    #    ####    ###
//  #   #                         #           #   #                                      # #   #   #    #
//  #   #   ###   # ##    ###     #     ##    #       ###   ## #    ##    # ##    ## #  #   #  #   #    #
//  ####   #   #  ##  #  #   #    #      #    #          #  # # #    #    ##  #  #  #   #   #  ####     #
//  # #    #   #  #   #  #        #      #    #  ##   ####  # # #    #    #   #   ##    #####  #        #
//  #  #   #   #  #   #  #   #    #      #    #   #  #   #  # # #    #    #   #  #      #   #  #        #
//  #   #   ###   #   #   ###    ###    ###    ###    ####  #   #   ###   #   #   ###   #   #  #       ###
//                                                                               #   #
//                                                                                ###
/**
 * A class that represents the roncli Gaming API.
 */
class RoncliGamingAPI {
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
        res.json({data: ConfigFile.get("roncliGaming") || []});
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

        obj.roncliGaming = ConfigFile.get("roncliGaming");

        Object.assign(obj.roncliGaming, req.body);

        ConfigFile.set(obj);

        Websocket.broadcast({
            type: "settings",
            data: {
                type: "roncliGaming",
                data: req.body
            }
        });

        res.sendStatus(204);
    }
}

RoncliGamingAPI.route = {
    path: "/api/roncliGaming"
};

module.exports = RoncliGamingAPI;
