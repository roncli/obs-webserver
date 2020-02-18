const request = require("request"),
    {promisify} = require("util");

const leagues = {
    "coh": "Zelda Story Mode",
    "cad": "Cadence All Zones",
    "mel": "Melody All Zones"
};

//  #   #                                  #                                      ###                     #                 ###
//  #   #                                  #                                     #   #                    #                #   #
//  ##  #   ###    ###   # ##    ###    ## #   ###   # ##    ###    ###   # ##   #       ###   # ##    ## #   ###   # ##   #  ##
//  # # #  #   #  #   #  ##  #  #   #  #  ##      #  ##  #  #   #  #   #  ##  #  #      #   #  ##  #  #  ##  #   #  ##  #   ## #
//  #  ##  #####  #      #      #   #  #   #   ####  #   #  #      #####  #      #      #   #  #   #  #   #  #   #  #          #
//  #   #  #      #   #  #      #   #  #  ##  #   #  #   #  #   #  #      #      #   #  #   #  #   #  #  ##  #   #  #         #
//  #   #   ###    ###   #       ###    ## #   ####  #   #   ###    ###   #       ###    ###   #   #   ## #   ###   #       ##
/**
 * API to return stats for Necrodancer CoNDOR season 9.
 */
class NecrodancerCondor9 {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Returns stats for Necrodancer CoNDOR season 9.
     * @param {object} req The request object.
     * @param {object} res The response object.
     * @returns {Promise} A promise that returns when the request is fulfilled.
     */
    static async get(req, res) {
        try {
            const response = JSON.parse((await promisify(request)("https://condor.live/api/event")).body);

            const apiReturn = {
                races: {
                    previousResults: [],
                    upcomingMatches: []
                },
                tiers: {}
            };

            for (const matchData of response.matches) {
                const match = {
                    league: leagues[matchData.league_tag],
                    player1: matchData.racer_1_twitch,
                    player2: matchData.racer_2_twitch,
                    date: new Date(matchData.suggested_time),
                    dateStr: new Date(matchData.suggested_time).toLocaleString("en-us", {timeZone: "America/Los_Angeles", weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short"}),
                    cawmentary: matchData.commentary,
                    winner: +matchData.racer_1_wins + +matchData.racer_2_wins < (matchData.league_tag === "coh" ? 2 : 3) ? "Pending" : +matchData.racer_1_wins > +matchData.racer_2_wins ? matchData.racer_1_twitch : +matchData.racer_1_wins < +matchData.racer_2_wins ? matchData.racer_2_twitch : "Tie",
                    score: +matchData.racer_1_wins > +matchData.racer_2_wins ? `${matchData.racer_1_wins}-${matchData.racer_2_wins}` : `${matchData.racer_2_wins}-${matchData.racer_1_wins}`
                }

                if (match.date && match.date.getTime() < new Date().getTime()) {
                    apiReturn.races.previousResults.push(match);
                } else {
                    apiReturn.races.upcomingMatches.push(match);
                }
            }

            apiReturn.races.previousResults.sort((a, b) => {
                if (b.date && a.date) {
                    return b.date.getTime() - a.date.getTime();
                }
                if (a.date) {
                    return -1;
                }
                if (b.date) {
                    return 1;
                }
                return 0;
            });

            apiReturn.races.upcomingMatches.sort((a, b) => {
                if (a.date && b.date) {
                    return a.date.getTime() - b.date.getTime();
                }
                if (a.date) {
                    return -1;
                }
                if (b.date) {
                    return 1;
                }
                return 0;
            });

            res.status(200);
            res.send(JSON.stringify(apiReturn));
            res.end();
        } catch (err) {
            res.sendStatus(500);
            console.log(err);
        }
    }
}

module.exports = NecrodancerCondor9;
