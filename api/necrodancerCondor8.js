const {promisify} = require("util"),
    GS = require("google-spreadsheet");

//  #   #                                  #                                      ###                     #                 ###
//  #   #                                  #                                     #   #                    #                #   #
//  ##  #   ###    ###   # ##    ###    ## #   ###   # ##    ###    ###   # ##   #       ###   # ##    ## #   ###   # ##   #   #
//  # # #  #   #  #   #  ##  #  #   #  #  ##      #  ##  #  #   #  #   #  ##  #  #      #   #  ##  #  #  ##  #   #  ##  #   ###
//  #  ##  #####  #      #      #   #  #   #   ####  #   #  #      #####  #      #      #   #  #   #  #   #  #   #  #      #   #
//  #   #  #      #   #  #      #   #  #  ##  #   #  #   #  #   #  #      #      #   #  #   #  #   #  #  ##  #   #  #      #   #
//  #   #   ###    ###   #       ###    ## #   ####  #   #   ###    ###   #       ###    ###   #   #   ## #   ###   #       ###
/**
 * API to return stats for Necrodancer CoNDOR season 8.
 */
class NecrodancerCondor8 {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Returns stats for Necrodancer CoNDOR season 8.
     * @param {object} req The request object.
     * @param {object} res The response object.
     * @returns {void}
     */
    static async get(req, res) {
        try {
            const doc = new GS("1LOmQPx5nnqgvsh6RpEn8tfz-YFScmLo1x88ly5WIKjY"),
                creds = require("../roncli.com-968d02fefdb4.json"),
                apiReturn = {
                    races: {
                        previousResults: [],
                        upcomingMatches: []
                    },
                    tiers: {}
                };

            await promisify(doc.useServiceAccountAuth)(creds);

            const info = await promisify(doc.getInfo)(),
                week = info.worksheets.find((sheet) => sheet.title === "Current Week Schedule"),
                results = await promisify(week.getCells)({
                    "min-row": 4,
                    "max-row": 300,
                    "min-col": 3,
                    "max-col": 8
                }),
                weekTable = [];
            let index, match;

            results.forEach((result) => {
                if (!weekTable[result.row]) {
                    weekTable[result.row] = [];
                }
                weekTable[result.row][result.col] = typeof result.numericValue === "number" ? result.numericValue : result.value;
            });

            const initDate = new Date(Date.UTC(1899, 11, 30, 4));

            for (index = 4; index < weekTable.length; index++) {
                if (!weekTable[index] || !(weekTable[index][3] && weekTable[index][4])) {
                    continue;
                }

                match = {
                    player1: weekTable[index][3],
                    player2: weekTable[index][4]
                };

                if (weekTable[index][5] && typeof weekTable[index][5] === "number") {
                    match.date = new Date(initDate.getTime() + weekTable[index][5] * 86400000 + 100);
                    match.dateStr = match.date.toLocaleString("en-us", {timeZone: "America/Los_Angeles", weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short"});
                }

                if (weekTable[index][8]) {
                    match.cawmentary = weekTable[index][8];
                }

                if (weekTable[index][6]) {
                    match.winner = weekTable[index][6];
                }

                match.score = weekTable[index][7] ? weekTable[index][7] : "Pending";

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

            const tiers = info.worksheets.find((sheet) => sheet.title === "Standings"),
                tierResults = await promisify(tiers.getCells)({
                    "min-row": 4,
                    "max-row": 100,
                    "min-col": 1,
                    "max-col": 2
                }),
                tierTable = [];

            tierResults.forEach((result) => {
                if (!tierTable[result.row]) {
                    tierTable[result.row] = [];
                }
                tierTable[result.row][result.col] = result.value;
            });

            for (index = 4; index < tierTable.length; index++) {
                apiReturn.tiers[tierTable[index][1].toLowerCase()] = tierTable[index][2];
            }

            res.status(200);
            res.send(JSON.stringify(apiReturn));
            res.end();
        } catch (err) {
            res.sendStatus(500);
            console.log(err);
        }
    }
}

module.exports = NecrodancerCondor8;
