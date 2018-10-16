const db = require("../database");

//   ###   #                                          #                          #####                        #
//  #   #  #                                          #                          #                            #
//  #   #  # ##    ###    ###   # ##   #   #   ###   ####    ###   # ##   #   #  #      #   #   ###   # ##   ####    ###
//  #   #  ##  #  #      #   #  ##  #  #   #      #   #     #   #  ##  #  #   #  ####   #   #  #   #  ##  #   #     #
//  #   #  #   #   ###   #####  #       # #    ####   #     #   #  #      #  ##  #       # #   #####  #   #   #      ###
//  #   #  ##  #      #  #      #       # #   #   #   #  #  #   #  #       ## #  #       # #   #      #   #   #  #      #
//   ###   # ##   ####    ###   #        #     ####    ##    ###   #          #  #####    #     ###   #   #    ##   ####
//                                                                        #   #
//                                                                         ###
/**
 * API to return stats for The Observatory seasons.
 */
class ObservatoryEvents {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Returns stats for the Observatory seasons.
     * @param {object} req The request object.
     * @param {object} res The response object.
     * @returns {void}
     */
    static async get(req, res) {
        try {
            const data = await db.query("SELECT EventID, Event, Date, Season FROM tblEvent"),
                events = data && data.recordsets && data.recordsets[0] && data.recordsets[0].map((row) => ({id: row.EventID, event: row.Event, date: row.Date, season: row.Season}));

            res.status(200);
            res.send(events);
            res.end();
        } catch (err) {
            res.sendStatus(500);
            console.log(err);
        }
    }
}

module.exports = ObservatoryEvents;
