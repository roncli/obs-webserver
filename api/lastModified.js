const fs = require("fs").promises;

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
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Returns the last modified date of the file.
     * @param {Request} req The request object.
     * @param {Response} res The response object.
     * @returns {void}
     */
    static async get(req, res) {
        try {
            const data = await fs.stat(req.query.file);

            res.status(200);
            res.send(data.mtime);
            res.end();
        } catch (err) {
            res.sendStatus(500);
            console.log(err);
        }
    }
}

module.exports = LastModified;
