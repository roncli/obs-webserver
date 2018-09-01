const fs = require("fs").promises;

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
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Returns the file.
     * @param {object} req The request object.
     * @param {object} res The response object.
     * @returns {void}
     */
    static async get(req, res) {
        try {
            const data = await fs.readFile(req.query.file);

            res.status(200);
            if (req.query.base64) {
                res.send(Buffer.from(data).toString("base64"));
            } else {
                res.send(data);
            }
            res.end();
        } catch (err) {
            res.sendStatus(500);
            console.log(err);
        }
    }
}

module.exports = Local;
