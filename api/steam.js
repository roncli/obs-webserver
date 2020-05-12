const steam = require("steam-api"),
    settings = require("../settings"),
    steamPlayer = new steam.Player(settings.steam.apikey, "76561197996696153");

//   ###    #
//  #   #   #
//  #      ####    ###    ###   ## #
//   ###    #     #   #      #  # # #
//      #   #     #####   ####  # # #
//  #   #   #  #  #      #   #  # # #
//   ###     ##    ###    ####  #   #
/**
 * API to retrieve stats from Steam.
 */
class Steam {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Returns stats from Steam.
     * @param {object} req The request object.
     * @param {object} res The response object.
     * @returns {Promise} A promise that resolves when the stats have been retrieved.
     */
    static async get(req, res) {
        try {
            const games = await steamPlayer.GetOwnedGames("76561197996696153", true, true);

            res.status(200);
            res.send(JSON.stringify(games));
            res.end();
        } catch (err) {
            res.sendStatus(500);
            console.log(err);
        }
    }
}

module.exports = Steam;
