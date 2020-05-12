const request = require("@root/request"),
    {promisify} = require("util");

//  ####           ##     ###    #             #
//   #  #           #    #   #   #             #
//   #  #   ###     #    #      ####    ###   ####    ###
//   #  #  #   #    #     ###    #         #   #     #
//   #  #  #        #        #   #      ####   #      ###
//   #  #  #   #    #    #   #   #  #  #   #   #  #      #
//  ####    ###    ###    ###     ##    ####    ##   ####
/**
 * API to retrieve DCL stats.
 */
class DclStats {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Returns stats for the DCL.
     * @param {object} req The request object.
     * @param {object} res The response object.
     * @returns {Promise} A promise that resolves when the DCL stats have been retrieved.
     */
    static async get(req, res) {
        try {
            const response = await promisify(request)("http://descentchampions.org/pilot_data.php?uid=114");
            res.status(200);
            res.send(response.body);
            res.end();
        } catch (err) {
            res.sendStatus(500);
            console.log(err);
        }
    }
}

module.exports = DclStats;
