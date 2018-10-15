const Db = require("node-database"),
    db = require("../database");

//   ###   #                                          #                           ###
//  #   #  #                                          #                          #   #
//  #   #  # ##    ###    ###   # ##   #   #   ###   ####    ###   # ##   #   #  #       ###    ###    ###    ###   # ##
//  #   #  ##  #  #      #   #  ##  #  #   #      #   #     #   #  ##  #  #   #   ###   #   #      #  #      #   #  ##  #
//  #   #  #   #   ###   #####  #       # #    ####   #     #   #  #      #  ##      #  #####   ####   ###   #   #  #   #
//  #   #  ##  #      #  #      #       # #   #   #   #  #  #   #  #       ## #  #   #  #      #   #      #  #   #  #   #
//   ###   # ##   ####    ###   #        #     ####    ##    ###   #          #   ###    ###    ####  ####    ###   #   #
//                                                                        #   #
//                                                                         ###
/**
 * API to return stats for an Observatory season.
 */
class ObservatorySeason {
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
            const season = +req.query.season,
                eventData = await db.query("SELECT EventID FROM tblEvent WHERE Season = @season AND Event LIKE '%Qualifier%' ORDER BY EventID", {season: {type: Db.INT, value: season}}),
                eventIds = eventData && eventData.recordsets && eventData.recordsets[0] && eventData.recordsets[0].map((row) => row.EventID);

            if (!eventIds || eventIds.length === 0) {
                res.sendStatus(404);
                return;
            }

            const ret = {
                qualifier: {},
                standings: []
            };

            let qualifier = 0;

            const standings = {};

            for (const eventId of eventIds) {
                qualifier++;

                const matchData = await db.query(`
                    SELECT MatchID, Map, Round FROM tblMatch WHERE EventID = @eventId

                    SELECT s.MatchID, p.Name, s.Score
                    FROM tblScore s
                    INNER JOIN tblPlayer p ON s.PlayerID = p.PlayerID
                    WHERE s.MatchID IN (SELECT MatchID FROM tblMatch WHERE EventID = @eventId)
                `, {eventId: {type: Db.INT, value: eventId}}),
                    matches = matchData && matchData.recordsets && matchData.recordsets[0] && matchData.recordsets[0].map((row) => ({id: row.MatchID, map: row.Map, round: row.Round})),
                    scores = matchData && matchData.recordsets && matchData.recordsets[1] && matchData.recordsets[1].map((row) => ({matchId: row.MatchID, name: row.Name, score: row.Score})),
                    defeated = {};


                ret.qualifier[qualifier] = {};

                matches.forEach((match) => {
                    const matchScores = scores.filter((score) => score.matchId === match.id).map((score) => ({name: score.name, score: score.score})).sort((a, b) => b.score - a.score);

                    if (!ret.qualifier[qualifier][match.round]) {
                        ret.qualifier[qualifier][match.round] = [];
                    }

                    ret.qualifier[qualifier][match.round].push({
                        map: match.map,
                        score: matchScores
                    });

                    if (!standings[matchScores[0].name]) {
                        standings[matchScores[0].name] = {};
                    }

                    if (!standings[matchScores[0].name][qualifier]) {
                        standings[matchScores[0].name][qualifier] = {
                            wins: 0,
                            losses: 0,
                            points: 0
                        };
                    }

                    if (!defeated[matchScores[0].name]) {
                        defeated[matchScores[0].name] = [];
                    }

                    if (!standings[matchScores[1].name]) {
                        standings[matchScores[1].name] = {};
                    }

                    if (!standings[matchScores[1].name][qualifier]) {
                        standings[matchScores[1].name][qualifier] = {
                            wins: 0,
                            losses: 0,
                            points: 0
                        };
                    }

                    if (!defeated[matchScores[1].name]) {
                        defeated[matchScores[1].name] = [];
                    }

                    standings[matchScores[0].name][qualifier].wins++;
                    standings[matchScores[1].name][qualifier].losses++;
                    defeated[matchScores[0].name].push(matchScores[1].name);
                });

                Object.keys(standings).forEach((player) => {
                    if (standings[player][qualifier]) {
                        standings[player][qualifier].points = standings[player][qualifier].wins * (season === 1 ? 1 : 3) + (defeated[player] ? defeated[player].reduce((accumulator, currentValue) => accumulator + standings[currentValue][qualifier].wins, 0) : 0);
                    }
                });
            }

            Object.keys(standings).forEach((player) => {
                ret.standings.push({
                    name: player,
                    points: Object.keys(standings[player]).reduce((accumulator, currentValue) => accumulator + standings[player][currentValue].points, 0),
                    qualifiers: standings[player]
                });
            });

            ret.standings.sort((a, b) => b.points - a.points);

            const finalsData = await db.query("SELECT EventID FROM tblEvent WHERE Season = @season AND Event LIKE '%Finals Tournament%' ORDER BY EventID", {season: {type: Db.INT, value: season}}),
                finalsEventId = finalsData && finalsData.recordsets && finalsData.recordsets[0] && finalsData.recordsets[0][0] && finalsData.recordsets[0][0].EventID;

            if (finalsEventId) {
                ret.finals = {};

                const matchData = await db.query(`
                    SELECT MatchID, Map, Round FROM tblMatch WHERE EventID = @eventId

                    SELECT s.MatchID, p.Name, s.Score
                    FROM tblScore s
                    INNER JOIN tblPlayer p ON s.PlayerID = p.PlayerID
                    WHERE s.MatchID IN (SELECT MatchID FROM tblMatch WHERE EventID = @eventId)

                    SELECT DISTINCT p.Name, r.Rating
                    FROM tblRating r
                    INNER JOIN tblPlayer p ON r.PlayerID = p.PlayerID
                    INNER JOIN tblScore s ON r.PlayerID = s.PlayerID
                    INNER JOIN tblMatch m ON s.MatchID = m.MatchID
                    WHERE m.EventID = @eventId
                        AND r.EventID = @eventId - 1
                `, {eventId: {type: Db.INT, value: finalsEventId}}),
                    matches = matchData && matchData.recordsets && matchData.recordsets[0] && matchData.recordsets[0].map((row) => ({id: row.MatchID, map: row.Map, round: row.Round})),
                    scores = matchData && matchData.recordsets && matchData.recordsets[1] && matchData.recordsets[1].map((row) => ({matchId: row.MatchID, name: row.Name, score: row.Score})),
                    ratings = matchData && matchData.recordsets && matchData.recordsets[2] && matchData.recordsets[2].map((row) => ({name: row.Name, rating: row.Rating}));

                const seeding = ratings.map((rating) => ({name: rating.name, seedPoints: ret.standings.find((standing) => standing.name === rating.name).points + rating.rating / 100000}));

                seeding.sort((a, b) => b.seedPoints - a.seedPoints);

                matches.forEach((match) => {
                    const matchScores = scores.filter((score) => score.matchId === match.id).map((score) => ({name: score.name, seed: seeding.map((seed) => seed.name).indexOf(score.name) + 1, score: score.score})).sort((a, b) => b.score - a.score);

                    if (!ret.finals[match.round]) {
                        ret.finals[match.round] = [];
                    }

                    ret.finals[match.round].push({
                        map: match.map,
                        score: matchScores.sort((a, b) => a.seed - b.seed)
                    });
                });

                Object.keys(ret.finals).forEach((round) => {
                    ret.finals[round].sort((a, b) => a.score[0].seed - b.score[0].seed);
                });
            }

            res.status(200);
            res.send(ret);
            res.end();
        } catch (err) {
            res.sendStatus(500);
            console.log(err);
        }
    }
}

module.exports = ObservatorySeason;
