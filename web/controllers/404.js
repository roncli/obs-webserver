const Common = require("../includes/common"),
    NotFoundView = require("../../public/views/404");

/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 */

//  #   #          #     #####                           #
//  #   #          #     #                               #
//  ##  #   ###   ####   #       ###   #   #  # ##    ## #
//  # # #  #   #   #     ####   #   #  #   #  ##  #  #  ##
//  #  ##  #   #   #     #      #   #  #   #  #   #  #   #
//  #   #  #   #   #  #  #      #   #  #  ##  #   #  #  ##
//  #   #   ###     ##   #       ###    ## #  #   #   ## #
/**
 * A class that represents the 404 page.
 */
class NotFound {
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
        res.status(404).send(Common.page(
            "",
            {css: ["/css/error.css"]},
            NotFoundView.get("This page does not exist.")
        ));
    }
}

NotFound.route = {
    path: "/404"
};

module.exports = NotFound;
