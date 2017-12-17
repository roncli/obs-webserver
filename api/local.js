const fs = require("fs");

//  #                            ##
//  #                             #
//  #       ###    ###    ###     #
//  #      #   #  #   #      #    #
//  #      #   #  #       ####    #
//  #      #   #  #   #  #   #    #
//  #####   ###    ###    ####   ###
/**
 * API to retrieve local files.
 */
class Local {
    //                     #
    //                     #
    // ###    ##    ###   ###
    // #  #  #  #  ##      #
    // #  #  #  #    ##    #
    // ###    ##   ###      ##
    // #
    /**
     * Returns the file.
     * @param {object} req The request object.
     * @param {string} req.body.file The filename.
     * @param {boolean} req.body.base64 Whether to base64 encode the file.
     * @param {object} res The response object.
     * @returns {void}
     */
    static post(req, res) {
        fs.readFile(req.body.file, (err, data) => {
            if (err) {
                res.status(500);
                res.end();
                return;
            }

            res.status(200);
            if (req.body.base64) {
                res.send(Buffer.from(data).toString("base64"));
            } else {
                res.send(data);
            }
            res.end();
        });
    }
}

module.exports = Local;
