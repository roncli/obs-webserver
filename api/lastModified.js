const fs = require("fs");

//  #                     #     #   #             #    #      ##     #               #
//  #                     #     #   #             #          #  #                    #
//  #       ###    ###   ####   ## ##   ###    ## #   ##     #      ##     ###    ## #
//  #          #  #       #     # # #  #   #  #  ##    #    ####     #    #   #  #  ##
//  #       ####   ###    #     #   #  #   #  #   #    #     #       #    #####  #   #
//  #      #   #      #   #  #  #   #  #   #  #  ##    #     #       #    #      #  ##
//  #####   ####  ####     ##   #   #   ###    ## #   ###    #      ###    ###    ## #
/**
 * API to retrieve the last modified date of a file.
 */
class LastModified {
    //                     #
    //                     #
    // ###    ##    ###   ###
    // #  #  #  #  ##      #
    // #  #  #  #    ##    #
    // ###    ##   ###      ##
    // #
    /**
     * Returns the last modified date of the file.
     * @param {object} req The request object.
     * @param {string} req.body.file The filename.
     * @param {object} res The response object.
     * @returns {void}
     */
    static post(req, res) {
        fs.stat(req.body.file, (err, data) => {
            if (err) {
                res.status(500);
                res.end();
                return;
            }

            res.status(200);
            res.send(data.mtime);
            res.end();
        });
    }
}

module.exports = LastModified;
