const request = require("request"),
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
     * @returns {void}
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
