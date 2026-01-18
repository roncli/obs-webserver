/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 */

const Common = require("../includes/common"),
    OverlayView = require("../../public/views/overlay");

// MARK: class Overlay
/**
 * A class that handles the overlay page.
 */
class Overlay {
    // MARK: static get
    /**
     * Processes the request.
     * @param {Express.Request} req The request.
     * @param {Express.Response} res The response.
     * @returns {void}
     */
    static get(req, res) {
        res.status(200).send(Common.page(
            "",
            {css: ["/css/overlay.css"], js: ["/js/overlay.js"]},
            OverlayView.get()
        ));
    }
}

Overlay.route = {
    path: "/overlay"
};

module.exports = Overlay;
