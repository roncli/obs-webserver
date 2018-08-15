const {promisify} = require("util"),
    GS = require("google-spreadsheet");

//  #   #                                  #                                      ###                     #                #####
//  #   #                                  #                                     #   #                    #                    #
//  ##  #   ###    ###   # ##    ###    ## #   ###   # ##    ###    ###   # ##   #       ###   # ##    ## #   ###   # ##      #
//  # # #  #   #  #   #  ##  #  #   #  #  ##      #  ##  #  #   #  #   #  ##  #  #      #   #  ##  #  #  ##  #   #  ##  #     #
//  #  ##  #####  #      #      #   #  #   #   ####  #   #  #      #####  #      #      #   #  #   #  #   #  #   #  #        #
//  #   #  #      #   #  #      #   #  #  ##  #   #  #   #  #   #  #      #      #   #  #   #  #   #  #  ##  #   #  #       #
//  #   #   ###    ###   #       ###    ## #   ####  #   #   ###    ###   #       ###    ###   #   #   ## #   ###   #       #
/**
 * API to return stats for Necrodancer CoNDOR season 7.
 */
class NecrodancerCondor7 {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Returns stats for Necrodancer CoNDOR season 7.
     * @param {object} req The request object.
     * @param {object} res The response object.
     * @returns {void}
     */
    static async get(req, res) {
        try {
            const doc = new GS("1ZrDUfY5BgIpFkYH-0uEAPDjdrWFlH_zUp_e0F0irNhc"),
                creds = require("../roncli.com-968d02fefdb4.json"),
                apiReturn = {
                    races: {},
                    standings: []
                };

            await promisify(doc.useServiceAccountAuth)(creds);

            const info = await promisify(doc.getInfo)();

            const week = info.worksheets.find((sheet) => sheet.title === "Current Week - Sorted Schedule");

            const results = await promisify(week.getCells)({
                "min-row": 4,
                "max-row": 100,
                "min-col": 2,
                "max-col": 8
            });

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

                if (!apiReturn.races[tier]) {
                    apiReturn.races[tier] = {
                        previousResults: [],
                        upcomingMatches: []
                    };
                }

                if (match.date && match.date.getTime() < new Date().getTime()) {
                    apiReturn.races[tier].previousResults.push(match);
                } else {
                    apiReturn.races[tier].upcomingMatches.push(match);
                }
            }

            Object.keys(apiReturn.races).forEach((returnTier) => {
                apiReturn.races[returnTier].previousResults.sort((a, b) => {
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

                apiReturn.races[returnTier].upcomingMatches.sort((a, b) => {
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

            const qtpi = info.worksheets.find((sheet) => sheet.title === "QTPi Standings");

            const standings = await promisify(qtpi.getCells)({
                "min-row": 5,
                "max-row": 100,
                "min-col": 1,
                "max-col": 17
            });

            const qtpiTable = [];

            standings.forEach((standing) => {
                if (!qtpiTable[standing.row]) {
                    qtpiTable[standing.row] = [];
                }
                qtpiTable[standing.row][standing.col] = typeof standing.numericValue === "number" ? standing.numericValue : standing.value;
            });

            qtpiTable.forEach((standing) => {
                if (standing[1]) {
                    apiReturn.standings.push({
                        player: standing[1],
                        points: standing[2],
                        week1: (standing[3] || 0) + (standing[4] || 0) + (standing[5] || 0),
                        week2: (standing[6] || 0) + (standing[7] || 0) + (standing[8] || 0),
                        week3: (standing[9] || 0) + (standing[10] || 0) + (standing[11] || 0),
                        week4: (standing[12] || 0) + (standing[13] || 0) + (standing[14] || 0),
                        week5: (standing[15] || 0) + (standing[16] || 0) + (standing[17] || 0)
                    });
                }
            });

            apiReturn.standings.sort((a, b) => b.points - a.points);

            res.status(200);
            res.send(JSON.stringify(apiReturn));
            res.end();
        } catch (err) {
            res.sendStatus(500);
            console.log(err);
        }
    }
}

module.exports = NecrodancerCondor7;
