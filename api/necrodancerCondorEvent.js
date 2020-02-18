const request = require("request"),
    {promisify} = require("util");

//  #   #                                  #                                      ###                     #                #####                        #
//  #   #                                  #                                     #   #                    #                #                            #
//  ##  #   ###    ###   # ##    ###    ## #   ###   # ##    ###    ###   # ##   #       ###   # ##    ## #   ###   # ##   #      #   #   ###   # ##   ####
//  # # #  #   #  #   #  ##  #  #   #  #  ##      #  ##  #  #   #  #   #  ##  #  #      #   #  ##  #  #  ##  #   #  ##  #  ####   #   #  #   #  ##  #   #
//  #  ##  #####  #      #      #   #  #   #   ####  #   #  #      #####  #      #      #   #  #   #  #   #  #   #  #      #       # #   #####  #   #   #
//  #   #  #      #   #  #      #   #  #  ##  #   #  #   #  #   #  #      #      #   #  #   #  #   #  #  ##  #   #  #      #       # #   #      #   #   #  #
//  #   #   ###    ###   #       ###    ## #   ####  #   #   ###    ###   #       ###    ###   #   #   ## #   ###   #      #####    #     ###   #   #    ##
/**
 * API to return stats for the latest NecroDancer CoNDOR event.
 */
class NecrodancerCondorEvent {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Returns stats for the latest NecroDancer CoNDOR event.
     * @param {object} req The request object.
     * @param {object} res The response object.
     * @returns {void}
     */
    static async get(req, res) {
        try {
            const response = await promisify(request)("https://condor.live/api/event");

            if (!response || !response.body) {
                res.sendStatus(500);
                return;
            }

            const data = JSON.parse(response.body);

            res.status(200);
            res.send({
                name: data.event_name || "Season 9",
                previousResults: data.matches.filter((m) => +m.racer_1_wins + +m.racer_2_wins !== 0).map((m) => ({
                    player1: m.racer_1_twitch,
                    player2: m.racer_2_twitch,
                    date: new Date(m.suggested_time),
                    dateStr: new Date(m.suggested_time).toLocaleString("en-us", {timeZone: "America/Los_Angeles", weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short"}),
                    cawmentary: m.commentary ? `twitch.tv/${m.commentary}` : void 0,
                    winner: +m.racer_1_wins > +m.racer_2_wins ? m.racer_1_twitch : +m.racer_1_wins < +m.racer_2_wins ? m.racer_2_twitch : "Draw",
                    score: +m.racer_1_wins > +m.racer_2_wins ? `${m.racer_1_wins}-${m.racer_2_wins}` : `${m.racer_2_wins}-${m.racer_1_wins}`
                })).sort((a, b) => b.date.getTime() - a.date.getTime()),
                upcomingMatches: data.matches.filter((m) => +m.racer_1_wins + +m.racer_2_wins === 0).map((m) => ({
                    player1: m.racer_1_twitch,
                    player2: m.racer_2_twitch,
                    date: new Date(m.suggested_time),
                    dateStr: new Date(m.suggested_time).toLocaleString("en-us", {timeZone: "America/Los_Angeles", weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short"}),
                    cawmentary: m.commentary ? `twitch.tv/${m.commentary}` : void 0
                })).sort((a, b) => a.date.getTime() - b.date.getTime())
            });
            res.end();
        } catch (err) {
            res.sendStatus(500);
            console.log(err);
        }
    }
}

module.exports = NecrodancerCondorEvent;
