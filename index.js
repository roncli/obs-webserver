const express = require("express"),
    bodyParser = require("body-parser"),
    fs = require("fs"),
    http = require("http"),
    https = require("https"),
    GS = require("google-spreadsheet"),
    steam = require("steam-api"),
    config = require("./config"),
    steamPlayer = new steam.Player(config.steam.apikey, "76561197996696153"),
    Spotify = require("spotify-web-api-node"),
    spotify = new Spotify(config.spotify),
    steamGameInfoMatch = /Steam_Game_Info\.php\?Tab=2&AppID=(\d+)&/,
    app = express(),
    {JSDOM} = require("jsdom"),
    $ = require("jquery")(new JSDOM().window),

    api = function(url, callback) {
        (url.startsWith("https") ? https : http).get(url, (res) => {
            let body = "";

            res.on("data", (chunk) => {
                body += chunk;
            });

            res.on("end", () => {
                try {
                    callback(null, JSON.parse(body));
                } catch (err) {
                    callback(null, body);
                }
            });
        }).on("error", (err) => {
            callback(err);
        });
    };

let accessTokenValid = false;

app.use(express.static("public", {index: "index.htm"}));
app.use(bodyParser.urlencoded({extended: true}));

//                    #          ##                      ##
//    #                       #   #                       #
//   #    ###  ###   ##      #    #     ##    ##    ###   #
//  #    #  #  #  #   #     #     #    #  #  #     #  #   #
// #     # ##  #  #   #    #      #    #  #  #     # ##   #
//        # #  ###   ###         ###    ##    ##    # #  ###
//             #
app.post("/api/local", (req, res) => {
    fs.readFile(req.body.file, (err, data) => {
        if (err) {
            res.status(500);
            res.end();
            return;
        }

        res.status(200);
        if (req.body.base64) {
            res.send(Buffer.from(data).toString("base64"));
        } else {
            res.send(data);
        }
        res.end();
    });
});

//                    #          ##                  #    #  #           #   #      #    #             #
//    #                       #   #                  #    ####           #         # #                 #
//   #    ###  ###   ##      #    #     ###   ###   ###   ####   ##    ###  ##     #    ##     ##    ###
//  #    #  #  #  #   #     #     #    #  #  ##      #    #  #  #  #  #  #   #    ###    #    # ##  #  #
// #     # ##  #  #   #    #      #    # ##    ##    #    #  #  #  #  #  #   #     #     #    ##    #  #
//        # #  ###   ###         ###    # #  ###      ##  #  #   ##    ###  ###    #    ###    ##    ###
//             #
app.post("/api/lastModified", (req, res) => {
    fs.stat(req.body.file, (err, data) => {
        if (err) {
            res.status(500);
            res.end();
            return;
        }

        res.status(200);
        res.send(data.mtime);
        res.end();
    });
});

//                    #                                           #                                                  ##       #
//    #                       #                                   #                                                   #       #
//   #    ###  ###   ##      #   ###    ##    ##   ###    ##    ###   ###  ###    ##    ##   ###   #  #   ##   ###    #     ###   ##   #  #  ###
//  #    #  #  #  #   #     #    #  #  # ##  #     #  #  #  #  #  #  #  #  #  #  #     # ##  #  #  #  #  #  #  #  #   #    #  #  #     #  #  #  #
// #     # ##  #  #   #    #     #  #  ##    #     #     #  #  #  #  # ##  #  #  #     ##    #     ####  #  #  #      #    #  #  #     #  #  #  #
//        # #  ###   ###         #  #   ##    ##   #      ##    ###   # #  #  #   ##    ##   #     ####   ##   #     ###    ###   ##    ###  ###
//             #                                                                                                                             #
app.get("/api/necrodancerworldcup", (req, res) => {
    const doc = new GS("1y8ICS6uJ_XNOvSihcLmpVJF96e-buT9QZggJDktJWEo"),
        creds = require("./roncli.com-968d02fefdb4.json"),
        apiReturn = {};

    doc.useServiceAccountAuth(creds, (err) => {
        if (err) {
            res.status(200);
            res.send("{}");
            res.end();
            console.log(err);
            return;
        }

        doc.getInfo((err, info) => {
            if (err) {
                res.status(200);
                res.send("{}");
                res.end();
                console.log(err);
                return;
            }

            const standings = info.worksheets.find((sheet) => sheet.title === "Standings"),
                week1 = info.worksheets.find((sheet) => sheet.title === "Week 1"),
                week2 = info.worksheets.find((sheet) => sheet.title === "Week 2"),
                week3 = info.worksheets.find((sheet) => sheet.title === "Week 3");

            standings.getCells({
                "min-row": 5,
                "max-row": 40,
                "min-col": 1,
                "max-col": 10
            }, (err, results) => {
                const standingsTable = [],
                    table = [];
                let currentRow;

                if (err) {
                    res.status(200);
                    res.send("{}");
                    res.end();
                    console.log(err);
                    return;
                }

                results.forEach((result) => {
                    if (!standingsTable[result.row]) {
                        standingsTable[result.row] = [];
                    }
                    standingsTable[result.row][result.col] = typeof result.numericValue === "number" ? result.numericValue : result.value;
                });

                standingsTable.forEach((row) => {
                    let index;

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

                week3.getCells({
                    "min-row": 4,
                    "min-col": 2,
                    "max-col": 7
                }, (err, results) => {
                    const week3Table = [];
                    let index, match;

                    if (err) {
                        res.status(200);
                        res.send(JSON.stringify(apiReturn));
                        res.end();
                        console.log(err);
                        return;
                    }

                    results.forEach((result) => {
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

                    week2.getCells({
                        "min-row": 4,
                        "min-col": 2,
                        "max-col": 7
                    }, (err, results) => {
                        const week2Table = [];
                        let index, match;

                        if (err) {
                            res.status(200);
                            res.send(JSON.stringify(apiReturn));
                            res.end();
                            console.log(err);
                            return;
                        }

                        results.forEach((result) => {
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

                        week1.getCells({
                            "min-row": 4,
                            "min-col": 2,
                            "max-col": 7
                        }, (err, results) => {
                            const week1Table = [];
                            let index, match;

                            if (err) {
                                res.status(200);
                                res.send(JSON.stringify(apiReturn));
                                res.end();
                                console.log(err);
                                return;
                            }

                            results.forEach((result) => {
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

                            res.status(200);
                            res.send(JSON.stringify(apiReturn));
                            res.end();
                        });
                    });
                });
            });
        });
    });
});

//                    #                                           #                                                     #              ####
//    #                       #                                   #                                                     #              #
//   #    ###  ###   ##      #   ###    ##    ##   ###    ##    ###   ###  ###    ##    ##   ###    ##    ##   ###    ###   ##   ###   ###
//  #    #  #  #  #   #     #    #  #  # ##  #     #  #  #  #  #  #  #  #  #  #  #     # ##  #  #  #     #  #  #  #  #  #  #  #  #  #     #
// #     # ##  #  #   #    #     #  #  ##    #     #     #  #  #  #  # ##  #  #  #     ##    #     #     #  #  #  #  #  #  #  #  #     #  #
//        # #  ###   ###         #  #   ##    ##   #      ##    ###   # #  #  #   ##    ##   #      ##    ##   #  #   ###   ##   #      ##
//             #
app.get("/api/necrodancercondor5", (req, res) => {
    const doc = new GS("17GKLiNDS0o-5_SXgBfvFRHTF9RMRrpOwT_p-aJ-S0Uk"),
        creds = require("./roncli.com-968d02fefdb4.json"),
        apiReturn = {};

    doc.useServiceAccountAuth(creds, (err) => {
        if (err) {
            res.status(200);
            res.send("{}");
            res.end();
            console.log(err);
            return;
        }

        doc.getInfo((err, info) => {
            if (err) {
                res.status(200);
                res.send("{}");
                res.end();
                console.log(err);
                return;
            }

            const week = info.worksheets.find((sheet) => sheet.title === "Current Week - Sorted Schedule");

            week.getCells({
                "min-row": 4,
                "max-row": 100,
                "min-col": 2,
                "max-col": 8
            }, (err, results) => {
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

                Object.keys(apiReturn).forEach((tier) => {
                    apiReturn[tier].previousResults.sort((a, b) => {
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

                    apiReturn[tier].upcomingMatches.sort((a, b) => {
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
            });
        });
    });
});


//                    #                                           #                                                     #               ##
//    #                       #                                   #                                                     #              #
//   #    ###  ###   ##      #   ###    ##    ##   ###    ##    ###   ###  ###    ##    ##   ###    ##    ##   ###    ###   ##   ###   ###
//  #    #  #  #  #   #     #    #  #  # ##  #     #  #  #  #  #  #  #  #  #  #  #     # ##  #  #  #     #  #  #  #  #  #  #  #  #  #  #  #
// #     # ##  #  #   #    #     #  #  ##    #     #     #  #  #  #  # ##  #  #  #     ##    #     #     #  #  #  #  #  #  #  #  #     #  #
//        # #  ###   ###         #  #   ##    ##   #      ##    ###   # #  #  #   ##    ##   #      ##    ##   #  #   ###   ##   #      ##
//             #
app.get("/api/necrodancercondor6", (req, res) => {
    const doc = new GS("1wWJnyCYz6f8qCDMKA2786OO1KhquqV-FY044P10AiQw"),
        creds = require("./roncli.com-968d02fefdb4.json"),
        apiReturn = {};

    doc.useServiceAccountAuth(creds, (err) => {
        if (err) {
            res.status(200);
            res.send("{}");
            res.end();
            console.log(err);
            return;
        }

        doc.getInfo((err, info) => {
            if (err) {
                res.status(200);
                res.send("{}");
                res.end();
                console.log(err);
                return;
            }

            const week = info.worksheets.find((sheet) => sheet.title.startsWith("Current Week"));

            week.getCells({
                "min-row": 5,
                "max-row": 150,
                "min-col": 2,
                "max-col": 8
            }, (err, results) => {
                const weekTable = [];
                let index, tier, match;

                results.forEach((result) => {
                    if (!weekTable[result.row]) {
                        weekTable[result.row] = [];
                    }
                    weekTable[result.row][result.col] = typeof result.numericValue === "number" ? result.numericValue : result.value;
                });

                for (index = 5; index < weekTable.length; index++) {
                    if (!weekTable[index] || !(weekTable[index][3] && weekTable[index][4])) {
                        continue;
                    }

                    tier = weekTable[index][2];

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

                Object.keys(apiReturn).forEach((tier) => {
                    apiReturn[tier].previousResults.sort((a, b) => {
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

                    apiReturn[tier].upcomingMatches.sort((a, b) => {
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
            });
        });
    });
});

//                    #             #        ##            #           #
//    #                       #     #         #            #           #
//   #    ###  ###   ##      #    ###   ##    #     ###   ###    ###  ###    ###
//  #    #  #  #  #   #     #    #  #  #      #    ##      #    #  #   #    ##
// #     # ##  #  #   #    #     #  #  #      #      ##    #    # ##   #      ##
//        # #  ###   ###          ###   ##   ###   ###      ##   # #    ##  ###
//             #
app.get("/api/dclstats", (req, res) => {
    api("http://descentchampions.org/pilot_data.php?uid=114", (err, body) => {
        if (err) {
            console.log("Error while retrieving DCL data.");
            console.log(err);
            res.status(200);
            res.send("{}");
            res.end();
            return;
        }

        res.status(200);
        res.send(JSON.stringify(body));
        res.end();
    });
});

//                    #                  #
//    #                       #          #
//   #    ###  ###   ##      #    ###   ###    ##    ###  # #
//  #    #  #  #  #   #     #    ##      #    # ##  #  #  ####
// #     # ##  #  #   #    #       ##    #    ##    # ##  #  #
//        # #  ###   ###         ###      ##   ##    # #  #  #
//             #
app.get("/api/steam", (req, res) => {
    steamPlayer.GetOwnedGames("76561197996696153", true, true).then((games) => { // eslint-disable-line new-cap
        res.status(200);
        res.send(JSON.stringify(games));
        res.end();
    });
});

//                    #                        #           #
//    #                       #                #           #
//   #    ###  ###   ##      #    ###   ###   ###    ###  ###    ###
//  #    #  #  #  #   #     #    #  #  ##      #    #  #   #    ##
// #     # ##  #  #   #    #     # ##    ##    #    # ##   #      ##
//        # #  ###   ###          # #  ###      ##   # #    ##  ###
//             #
app.get("/api/astats", (req, res) => {
    api("http://astats.astats.nl/astats/User_Games.php?SteamID64=76561197996696153&DisplayType=1&AchievementsOnly=1", (err, body) => {
        body = `<div>${body.replace(/^[\s\S]*<body.*?>|<\/body>[\s\S]*$/ig, "")}</div>`;
        res.status(200);
        res.send(JSON.stringify($.makeArray($($(body).find("table")[1]).find("tbody tr").map((index, el) => {
            const $el = $(el);
            return {id: +steamGameInfoMatch.exec($($el.find("td")[0]).find("a").attr("href"))[1], percent: +$($el.find("td")[5]).text().replace("%", "")};
        }))));
        res.end();
    });
});

//                    #
//    #                       #
//   #    ###  ###   ##      #   ###   ###    ##   #  #  #  #
//  #    #  #  #  #   #     #    #  #  #  #  #  #   ##   #  #
// #     # ##  #  #   #    #     #  #  #     #  #   ##    # #
//        # #  ###   ###         ###   #      ##   #  #    #
//             #                 #                        #
app.get("/api/proxy", (req, res) => {
    http.get(req.query.url, (response) => {
        if (response.statusCode === 200) {
            res.writeHead(200, {"Content-Type": response.headers["content-type"]});
            response.pipe(res);
        } else {
            res.status(200);
            res.sendFile("public/images/roncliProductions60.png", {root: __dirname});
            console.log("SENDING");
        }
    });
});

//              #     ##                #     #      #         ###         #
//              #    #  #               #           # #         #          #
//  ###   ##   ###    #    ###    ##   ###   ##     #    #  #   #     ##   # #    ##   ###
// #  #  # ##   #      #   #  #  #  #   #     #    ###   #  #   #    #  #  ##    # ##  #  #
//  ##   ##     #    #  #  #  #  #  #   #     #     #     # #   #    #  #  # #   ##    #  #
// #      ##     ##   ##   ###    ##     ##  ###    #      #    #     ##   #  #   ##   #  #
//  ###                    #                              #
/**
 * Ensures that Spotify has an access token to work with.
 * @returns {Promise} A promise that resolves with the access token.
 */
const getSpotifyToken = () => {
    return new Promise((resolve, reject) => {
        if (accessTokenValid) {
            resolve();
            return;
        }

        spotify.refreshAccessToken().then((data) => {
            setTimeout(() => {
                accessTokenValid = false;
            }, 3540000);
            spotify.setAccessToken(data.body.access_token);
            resolve();
        });
    });
};

//                    #                              #     #      #         #  #              ###   ##                 #
//    #                       #                      #           # #        ## #              #  #   #
//   #    ###  ###   ##      #    ###   ###    ##   ###   ##     #    #  #  ## #   ##   #  #  #  #   #     ###  #  #  ##    ###    ###
//  #    #  #  #  #   #     #    ##     #  #  #  #   #     #    ###   #  #  # ##  #  #  #  #  ###    #    #  #  #  #   #    #  #  #  #
// #     # ##  #  #   #    #       ##   #  #  #  #   #     #     #     # #  # ##  #  #  ####  #      #    # ##   # #   #    #  #   ##
//        # #  ###   ###         ###    ###    ##     ##  ###    #      #   #  #   ##   ####  #     ###    # #    #   ###   #  #  #
//             #                        #                              #                                         #                 ###
app.get("/api/spotifyNowPlaying", (req, res) => {
    getSpotifyToken().then(() => {
        spotify.getMyCurrentPlayingTrack({}, (err, response) => {
            if (err) {
                if (err.statusCode === 400) {
                    res.send("{}");
                    res.status(200);
                    res.end();
                    return;
                }
                console.log(err);
                res.status(500);
                res.end();
                return;
            }

            res.status(200);
            res.send(JSON.stringify(response.body));
            res.end();
        });
    });
});

//                    #                ##                 ##
//    #                       #         #                #  #
//   #    ###  ###   ##      #   ###    #     ###  #  #   #     ##   ###    ###
//  #    #  #  #  #   #     #    #  #   #    #  #  #  #    #   #  #  #  #  #  #
// #     # ##  #  #   #    #     #  #   #    # ##   # #  #  #  #  #  #  #   ##
//        # #  ###   ###         ###   ###    # #    #    ##    ##   #  #  #
//             #                 #                  #                       ###
app.post("/api/playSong", (req, res) => {
    getSpotifyToken().then(() => {
        spotify.play({uris: req.body.track ? [req.body.track] : void 0, context_uri: req.body.playlist}, (err) => {
            if (err) {
                console.log(err);
                res.status(500);
                res.end();
                return;
            }

            if (req.body.stop) {
                spotify.getMyCurrentPlayingTrack({}, (err, response) => {
                    if (err) {
                        if (err.statusCode === 400) {
                            return;
                        }
                        console.log(err);
                        return;
                    }

                    if (response.item) {
                        setTimeout(() => {
                            spotify.pause({}, () => {});
                        }, response.item.duration_ms - response.progress_ms)
                    }
                });
            }

            res.status(204);
            res.end();
        });
    });
});

console.log("Listening on port 60577.");
app.listen(60577);

process.on("unhandledRejection", (err) => {
    console.log(err);
});
