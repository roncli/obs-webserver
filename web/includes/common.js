/**
 * @typedef {import("../../types/commonTypes").Files} CommonTypes.Files
 * @typedef {import("../../types/viewTypes").Option} ViewTypes.Option
 */

const HtmlMinifier = require("html-minifier"),
    Minify = require("../../src/minify"),
    settings = require("../../settings");

/** @type {typeof import("../../public/views/index")} */
let IndexView;

//   ###
//  #   #
//  #       ###   ## #   ## #    ###   # ##
//  #      #   #  # # #  # # #  #   #  ##  #
//  #      #   #  # # #  # # #  #   #  #   #
//  #   #  #   #  # # #  # # #  #   #  #   #
//   ###    ###   #   #  #   #   ###   #   #
/**
 * A class that handles common web functions.
 */
class Common {
    // ###    ###   ###   ##
    // #  #  #  #  #  #  # ##
    // #  #  # ##   ##   ##
    // ###    # #  #      ##
    // #            ###
    /**
     * Generates a webpage from the provided HTML using a common template.
     * @param {string} head The HTML to insert into the header.
     * @param {CommonTypes.Files} files The files to combine and minify.
     * @param {string} html The HTML to make a full web page from.
     * @returns {string} The HTML of the full web page.
     */
    static page(head, files, html) {
        if (!IndexView) {
            IndexView = require("../../public/views/index");
        }

        if (!files) {
            files = {js: [], css: []};
        }

        if (!files.js) {
            files.js = [];
        }

        if (!files.css) {
            files.css = [];
        }

        files.js.unshift("/js/common.js");
        files.css.unshift("/css/common.css");
        files.css.unshift("/css/reset.css");

        head = `${head}${Minify.combine(files.js, "js")}${Minify.combine(files.css, "css")}`;

        return HtmlMinifier.minify(
            IndexView.get({
                head,
                html
            }),
            settings.htmlMinifier
        );
    }

    // #      #          ##    ####                       #
    // #      #           #    #                          #
    // ###   ###   # #    #    ###   ###    ##    ##    ###   ##
    // #  #   #    ####   #    #     #  #  #     #  #  #  #  # ##
    // #  #   #    #  #   #    #     #  #  #     #  #  #  #  ##
    // #  #    ##  #  #  ###   ####  #  #   ##    ##    ###   ##
    /**
     * HTML-encodes a string.
     * @param {string} str The string.
     * @returns {string} The encoded string.
     */
    static htmlEncode(str) {
        return str && str.replace(/[\u0080-\uFFFF<>&]/gim, (i) => `&#${i.charCodeAt(0)};`).replace(/\r\n/gim, "<br />").replace(/[\r\n]/gim, "<br />") || "";
    }

    //                                      #           ##          #     #
    //                                      #          #  #         #
    //  ###   ##   ###    ##   ###    ###  ###    ##   #  #  ###   ###   ##     ##   ###    ###
    // #  #  # ##  #  #  # ##  #  #  #  #   #    # ##  #  #  #  #   #     #    #  #  #  #  ##
    //  ##   ##    #  #  ##    #     # ##   #    ##    #  #  #  #   #     #    #  #  #  #    ##
    // #      ##   #  #   ##   #      # #    ##   ##    ##   ###     ##  ###    ##   #  #  ###
    //  ###                                                  #
    /**
     * Generates an HTML string of options.
     * @param {ViewTypes.Option[]} options The options.
     * @param {string} [selected] The selected value.
     * @param {boolean} [includeEmpty] Whether to include an empty option.
     * @returns {string} The HTML string of options.
     */
    static generateOptions(options, selected, includeEmpty) {
        return /* html */`
            ${includeEmpty ? /* html */`
                <option value=""${!selected || selected === "" ? " selected" : ""}></option>
            ` : ""}
            ${options.map((o) => /* html */`
                <option value="${Common.htmlEncode(o.value)}"${selected === o.value ? " selected" : ""}>${Common.htmlEncode(o.text || o.value)}</option>
            `).join("")}
        `;
    }

    //   #          ####                       #
    //              #                          #
    //   #    ###   ###   ###    ##    ##    ###   ##
    //   #   ##     #     #  #  #     #  #  #  #  # ##
    //   #     ##   #     #  #  #     #  #  #  #  ##
    // # #   ###    ####  #  #   ##    ##    ###   ##
    //  #
    /**
     * Javascript-encodes a string.
     * @param {*} str The string.
     * @returns {string} The encoded string.
     */
    static jsEncode(str) {
        return str && str.replace(/"/gim, "\\\"") || "";
    }
}

Common.route = {
    include: true
};

module.exports = Common;
