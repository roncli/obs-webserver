const {promisify} = require("util"),
    GS = require("google-spreadsheet");

//  #   #                                  #                                      ###                     #                #####
//  #   #                                  #                                     #   #                    #                #
//  ##  #   ###    ###   # ##    ###    ## #   ###   # ##    ###    ###   # ##   #       ###   # ##    ## #   ###   # ##   # ##
//  # # #  #   #  #   #  ##  #  #   #  #  ##      #  ##  #  #   #  #   #  ##  #  #      #   #  ##  #  #  ##  #   #  ##  #  ##  #
//  #  ##  #####  #      #      #   #  #   #   ####  #   #  #      #####  #      #      #   #  #   #  #   #  #   #  #          #
//  #   #  #      #   #  #      #   #  #  ##  #   #  #   #  #   #  #      #      #   #  #   #  #   #  #  ##  #   #  #      #   #
//  #   #   ###    ###   #       ###    ## #   ####  #   #   ###    ###   #       ###    ###   #   #   ## #   ###   #       ###
/**
 * API to return stats for Necrodancer CoNDOR season 5.
 */
class NecrodancerCondor5 {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Returns stats for Necrodancer CoNDOR season 5.
     * @param {object} req The request object.
     * @param {object} res The response object.
     * @returns {void}
     */
    static get(req, res) {
        const doc = new GS("17GKLiNDS0o-5_SXgBfvFRHTF9RMRrpOwT_p-aJ-S0Uk"),
            creds = require("../roncli.com-968d02fefdb4.json"),
            apiReturn = {};

        promisify(doc.useServiceAccountAuth)(creds).then(() => promisify(doc.getInfo)()).then((info) => {
            const week = info.worksheets.find((sheet) => sheet.title === "Current Week - Sorted Schedule");

            return promisify(week.getCells)({
                "min-row": 4,
                "max-row": 100,
                "min-col": 2,
                "max-col": 8
            });
        }).then((results) => {
            const weekTable = [];
            let index, tier, match;

            results.forEach((result) => {
                if (!weekTable[result.row]) {
                    weekTable[result.row] = [];
                }
                weekTable[result.row][result.col] = typeof result.numericValue === "number" ? result.numericValue : result.value;
            });

            for (index = 4; index < weekTable.length; index++) {
                if (!weekTable[index] || !(weekTable[index][3] && weekTable[index][4])) {
                    continue;
                }

                tier = weekTable[index][2] === "Playoff - Seeding" ? "Playoffs" : weekTable[index][2];

                match = {
                    player1: weekTable[index][3],
                    player2: weekTable[index][4]
                };

                if (weekTable[index][5] && typeof weekTable[index][5] === "number") {
                    match.date = new Date(Date.UTC(1899, 11, 30, 4));
                    match.date = new Date(match.date.getTime() + weekTable[index][5] * 86400000 + 100);
                    match.dateStr = match.date.toLocaleString("en-us", {timeZone: "America/Los_Angeles", weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short"});
                }

                if (weekTable[index][6]) {
                    match.cawmentary = weekTable[index][6];
                }

                if (weekTable[index][7]) {
                    match.winner = weekTable[index][7];
                }

                match.score = weekTable[index][8] ? weekTable[index][8] : "Pending";

                if (!apiReturn[tier]) {
                    apiReturn[tier] = {
                        previousResults: [],
                        upcomingMatches: []
                    };
                }

                if (match.date && match.date.getTime() < new Date().getTime()) {
                    apiReturn[tier].previousResults.push(match);
                } else {
                    apiReturn[tier].upcomingMatches.push(match);
                }
            }

            Object.keys(apiReturn).forEach((returnTier) => {
                apiReturn[returnTier].previousResults.sort((a, b) => {
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

                apiReturn[returnTier].upcomingMatches.sort((a, b) => {
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
            });

            res.status(200);
            res.send(JSON.stringify(apiReturn));
            res.end();
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
    }
}

module.exports = NecrodancerCondor5;
