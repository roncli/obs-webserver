const Db = require("node-database"),
    db = require("../database");

//   ###   #                                          #                           ###    #             #
//  #   #  #                                          #                          #   #   #             #
//  #   #  # ##    ###    ###   # ##   #   #   ###   ####    ###   # ##   #   #  #      ####    ###   ####    ###
//  #   #  ##  #  #      #   #  ##  #  #   #      #   #     #   #  ##  #  #   #   ###    #         #   #     #
//  #   #  #   #   ###   #####  #       # #    ####   #     #   #  #      #  ##      #   #      ####   #      ###
//  #   #  ##  #      #  #      #       # #   #   #   #  #  #   #  #       ## #  #   #   #  #  #   #   #  #      #
//   ###   # ##   ####    ###   #        #     ####    ##    ###   #          #   ###     ##    ####    ##   ####
//                                                                        #   #
//                                                                         ###
/**
 * API to retrieve stats for The Observatory.
 */
class ObservatoryStats {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Returns stats for an Observatory season.
     * @param {object} req The request object.
     * @param {object} res The response object.
     * @returns {void}
     */
    static async get(req, res) {
        try {
            const data = await db.query(`
                SELECT EventID, Event FROM tblEvent

                SELECT MatchID, EventID FROM tblMatch

                SELECT PlayerID, MatchID, Score FROM tblScore

                SELECT ChampionPlayerID, RunnerUpPlayerID FROM tblSeason

                SELECT PlayerID, Name, Rating FROM tblPlayer
            `),
                events = data && data.recordsets && data.recordsets[0] && data.recordsets[0].map((row) => ({id: row.EventID, event: row.Event})),
                matches = data && data.recordsets && data.recordsets[1] && data.recordsets[1].map((row) => ({id: row.MatchID, eventId: row.EventID})),
                scores = data && data.recordsets && data.recordsets[2] && data.recordsets[2].map((row) => ({playerId: row.PlayerID, matchId: row.MatchID, score: row.Score})),
                seasons = data && data.recordsets && data.recordsets[3] && data.recordsets[3].map((row) => ({championPlayerId: row.ChampionPlayerID, runnerUpPlayerId: row.RunnerUpPlayerID})),
                players = data && data.recordsets && data.recordsets[4] && data.recordsets[4].map((row) => ({id: row.PlayerID, name: row.Name, rating: row.Rating, wins: 0, losses: 0, qualifierWins: 0, qualifierLosses: 0, finalsTournamentWins: 0, finalsTournamentLosses: 0, championshipSeasons: 0, runnerUpSeasons: 0}));

            matches.forEach((match) => {
                const matchScores = scores.filter((score) => score.matchId === match.id).sort((a, b) => b.score - a.score);

                if (matchScores.length !== 2) {
                    return;
                }

                const qualifier = events.find((event) => event.id === match.eventId).event.indexOf("Qualifier") !== -1,
                    winner = players.find((player) => player.id === matchScores[0].playerId),
                    loser = players.find((player) => player.id === matchScores[1].playerId);

                winner.wins++;
                loser.losses++;

                if (qualifier) {
                    winner.qualifierWins++;
                    loser.qualifierLosses++;
                } else {
                    winner.finalsTournamentWins++;
                    loser.finalsTournamentLosses++;
                }
            });

            seasons.forEach((season) => {
                players.find((player) => player.id === season.championPlayerId).championshipSeasons++;
                players.find((player) => player.id === season.runnerUpPlayerId).runnerUpSeasons++;
            });

            players.sort((a, b) => b.rating - a.rating);

            res.status(200);
            res.send(players);
            res.end();
        } catch (err) {
            res.sendStatus(500);
            console.log(err);
        }
    }
}

module.exports = ObservatoryStats;
