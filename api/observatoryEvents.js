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
            const data = await db.query("SELECT e.EventID, e.Event, e.Date, e.Season FROM tblEvent e INNER JOIN (SELECT DISTINCT(EventID) EventID FROM tblMatch) m ON e.EventID = m.EventID"),
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
