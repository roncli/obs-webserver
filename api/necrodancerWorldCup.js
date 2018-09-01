const {promisify} = require("util"),
    GS = require("google-spreadsheet");

//  #   #                                  #                                     #   #                 ##        #   ###
//  #   #                                  #                                     #   #                  #        #  #   #
//  ##  #   ###    ###   # ##    ###    ## #   ###   # ##    ###    ###   # ##   #   #   ###   # ##     #     ## #  #      #   #  # ##
//  # # #  #   #  #   #  ##  #  #   #  #  ##      #  ##  #  #   #  #   #  ##  #  # # #  #   #  ##  #    #    #  ##  #      #   #  ##  #
//  #  ##  #####  #      #      #   #  #   #   ####  #   #  #      #####  #      # # #  #   #  #        #    #   #  #      #   #  ##  #
//  #   #  #      #   #  #      #   #  #  ##  #   #  #   #  #   #  #      #      ## ##  #   #  #        #    #  ##  #   #  #  ##  # ##
//  #   #   ###    ###   #       ###    ## #   ####  #   #   ###    ###   #      #   #   ###   #       ###    ## #   ###    ## #  #
//                                                                                                                                #
//                                                                                                                                #
/**
 * API to return stats for the Necrodancer World Cup.
 */
class NecrodancerWorldCup {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Returns stats for the Necrodancer World Cup.
     * @param {object} req The request object.
     * @param {object} res The response object.
     * @returns {void}
     */
    static async get(req, res) {
        try {
            const doc = new GS("1y8ICS6uJ_XNOvSihcLmpVJF96e-buT9QZggJDktJWEo"),
                creds = require("../roncli.com-968d02fefdb4.json"),
                apiReturn = {},
                standingsTable = [],
                table = [];

            await promisify(doc.useServiceAccountAuth)(creds);

            const info = await promisify(doc.getInfo)(),
                standings = info.worksheets.find((sheet) => sheet.title === "Standings"),
                week1 = info.worksheets.find((sheet) => sheet.title === "Week 1"),
                week2 = info.worksheets.find((sheet) => sheet.title === "Week 2"),
                week3 = info.worksheets.find((sheet) => sheet.title === "Week 3"),
                standingsResults = await promisify(standings.getCells)({
                    "min-row": 5,
                    "max-row": 40,
                    "min-col": 1,
                    "max-col": 10
                }),
                week1Results = await promisify(week1.getCells)({
                    "min-row": 4,
                    "min-col": 2,
                    "max-col": 7
                }),
                week2Results = await promisify(week2.getCells)({
                    "min-row": 4,
                    "min-col": 2,
                    "max-col": 7
                }),
                week3Results = await promisify(week3.getCells)({
                    "min-row": 4,
                    "min-col": 2,
                    "max-col": 7
                }),
                week1Table = [],
                week2Table = [],
                week3Table = [];
            let index, match;

            standingsResults.forEach((result) => {
                if (!standingsTable[result.row]) {
                    standingsTable[result.row] = [];
                }
                standingsTable[result.row][result.col] = typeof result.numericValue === "number" ? result.numericValue : result.value;
            });

            let currentRow;

            standingsTable.forEach((row) => {
                if (row === void 0) {
                    return;
                }

                if (row[1] !== void 0) {
                    table.push({
                        region: row[1],
                        players: []
                    });
                    currentRow = row[1];
                    return;
                }

                const player = {};

                player.name = row[2];
                player.score = row[3];
                player.win3 = 0;
                player.win2 = 0;
                player.win1 = 0;
                player.win0 = 0;
                for (index = 4; index < row.length; index++) {
                    if (row[index] === void 0) {
                        continue;
                    }

                    switch (row[index]) {
                        case 0:
                            player.win0++;
                            break;
                        case 1:
                            player.win1++;
                            break;
                        case 2:
                            player.win2++;
                            break;
                        case 3:
                            player.win3++;
                            break;
                    }
                }

                const tableRow = table.find((region) => region.region === currentRow);

                tableRow.players.push(player);
                tableRow.players.sort((a, b) => {
                    if (a.score !== b.score) {
                        return b.score - a.score;
                    }

                    return a.win0 + a.win1 + a.win2 + a.win3 - b.win0 - b.win1 - b.win2 - b.win3;
                });
            });

            apiReturn.standings = table;
            apiReturn.previousResults = [];
            apiReturn.upcomingMatches = [];

            week1Results.forEach((result) => {
                if (!week1Table[result.row]) {
                    week1Table[result.row] = [];
                }
                week1Table[result.row][result.col] = typeof result.numericValue === "number" ? result.numericValue : result.value;
            });

            for (index = 4; index < week1Table.length; index++) {
                if (!week1Table[index] || !(week1Table[index][2] && week1Table[index][3])) {
                    continue;
                }
                match = {
                    player1: week1Table[index][2],
                    player2: week1Table[index][3]
                };

                if (week1Table[index][4] && typeof week1Table[index][4] === "number") {
                    match.date = new Date(Date.UTC(1899, 11, 30, 4));
                    match.date = new Date(match.date.getTime() + week1Table[index][4] * 86400000 + 100);
                    match.dateStr = match.date.toLocaleString("en-us", {timeZone: "America/Los_Angeles", weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short"});
                }

                if (week1Table[index][5]) {
                    match.cawmentary = week1Table[index][5];
                }

                if (week1Table[index][6]) {
                    match.winner = week1Table[index][6];
                }

                match.score = week1Table[index][7] ? week1Table[index][7] : "Pending";

                if (match.date && match.date.getTime() < new Date().getTime()) {
                    apiReturn.previousResults.push(match);
                    apiReturn.previousResults.sort((a, b) => {
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
                } else {
                    apiReturn.upcomingMatches.push(match);
                    apiReturn.upcomingMatches.sort((a, b) => {
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
                }
            }

            week2Results.forEach((result) => {
                if (!week2Table[result.row]) {
                    week2Table[result.row] = [];
                }
                week2Table[result.row][result.col] = typeof result.numericValue === "number" ? result.numericValue : result.value;
            });

            for (index = 4; index < week2Table.length; index++) {
                if (!week2Table[index] || !(week2Table[index][2] && week2Table[index][3])) {
                    continue;
                }
                match = {
                    player1: week2Table[index][2],
                    player2: week2Table[index][3]
                };

                if (week2Table[index][4] && typeof week2Table[index][4] === "number") {
                    match.date = new Date(Date.UTC(1899, 11, 30, 4));
                    match.date = new Date(match.date.getTime() + week2Table[index][4] * 86400000 + 100);
                    match.dateStr = match.date.toLocaleString("en-us", {timeZone: "America/Los_Angeles", weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short"});
                }

                if (week2Table[index][5]) {
                    match.cawmentary = week2Table[index][5];
                }

                if (week2Table[index][6]) {
                    match.winner = week2Table[index][6];
                }

                match.score = week2Table[index][7] ? week2Table[index][7] : "Pending";

                if (match.date && match.date.getTime() < new Date().getTime()) {
                    apiReturn.previousResults.push(match);
                    apiReturn.previousResults.sort((a, b) => {
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
                } else {
                    apiReturn.upcomingMatches.push(match);
                    apiReturn.upcomingMatches.sort((a, b) => {
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
                }
            }

            week3Results.forEach((result) => {
                if (!week3Table[result.row]) {
                    week3Table[result.row] = [];
                }
                week3Table[result.row][result.col] = typeof result.numericValue === "number" ? result.numericValue : result.value;
            });

            for (index = 4; index < week3Table.length; index++) {
                if (!week3Table[index] || !(week3Table[index][2] && week3Table[index][3])) {
                    continue;
                }
                match = {
                    player1: week3Table[index][2],
                    player2: week3Table[index][3]
                };

                if (week3Table[index][4] && typeof week3Table[index][4] === "number") {
                    match.date = new Date(Date.UTC(1899, 11, 30, 4));
                    match.date = new Date(match.date.getTime() + week3Table[index][4] * 86400000 + 100);
                    match.dateStr = match.date.toLocaleString("en-us", {timeZone: "America/Los_Angeles", weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short"});
                }

                if (week3Table[index][5]) {
                    match.cawmentary = week3Table[index][5];
                }

                if (week3Table[index][6]) {
                    match.winner = week3Table[index][6];
                }

                match.score = week3Table[index][7] ? week3Table[index][7] : "Pending";

                if (match.date && match.date.getTime() < new Date().getTime()) {
                    apiReturn.previousResults.push(match);
                    apiReturn.previousResults.sort((a, b) => {
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
                } else {
                    apiReturn.upcomingMatches.push(match);
                    apiReturn.upcomingMatches.sort((a, b) => {
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
                }
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

module.exports = NecrodancerWorldCup;
