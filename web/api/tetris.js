/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 */

const Websocket = require("../../src/websocket");

//  #####          #              #             #             #
//    #            #                           # #
//    #     ###   ####   # ##    ##     ###   #   #  # ##    ##
//    #    #   #   #     ##  #    #    #      #   #  ##  #    #
//    #    #####   #     #        #     ###   #####  ##  #    #
//    #    #       #  #  #        #        #  #   #  # ##     #
//    #     ###     ##   #       ###   ####   #   #  #       ###
//                                                   #
//                                                   #
/**
 * A class that represents the Tetris API.
 */
class TetrisApi {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Processes the request.
     * @param {Express.Request} req The request.
     * @param {Express.Response} res The response.
     * @returns {void}
     */
    static get(req, res) {
        res.json({
            "event-organization": "",
            "event-title": "",
            "event-status": "",
            "event-color": "#ffffff",
            "player-1": "",
            "player-1-score": "0",
            "player-1-info": "",
            "player-2": "",
            "player-2-score": "0",
            "player-2-info": "",
            "player-3": "",
            "player-3-score": "0",
            "player-3-info": "",
            "player-4": "",
            "player-4-score": "0",
            "player-4-info": ""
        });
    }

    //                        #
    //                        #
    //  # ##    ###    ###   ####
    //  ##  #  #   #  #       #
    //  ##  #  #   #   ###    #
    //  # ##   #   #      #   #  #
    //  #       ###   ####     ##
    //  #
    //  #
    /**
     * Processes the request.
     * @param {Express.Request} req The request.
     * @param {Express.Response} res The response.
     * @returns {void}
     */
    static post(req, res) {
        Websocket.broadcast({
            type: "tetris",
            data: {
                player1: {
                    name: req.body["player-1"],
                    score: req.body["player-1-score"] || 0,
                    info: req.body["player-1-info"]
                },
                player2: {
                    name: req.body["player-2"],
                    score: req.body["player-2-score"] || 0,
                    info: req.body["player-2-info"]
                },
                player3: {
                    name: req.body["player-3"],
                    score: req.body["player-3-score"] || 0,
                    info: req.body["player-3-info"]
                },
                player4: {
                    name: req.body["player-4"],
                    score: req.body["player-4-score"] || 0,
                    info: req.body["player-4-info"]
                },
                event: {
                    organization: req.body["event-organization"],
                    title: req.body["event-title"],
                    status: req.body["event-status"],
                    color: req.body["event-color"]
                }
            }
        });

        res.sendStatus(204);
    }
}

TetrisApi.route = {
    path: "/api/tetris"
};

module.exports = TetrisApi;
