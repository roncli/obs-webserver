const steam = require("steam-api"),
    config = require("./config"),
    steamPlayer = new steam.Player(config.steam.apikey, "76561197996696153");

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
     * @returns {void}
     */
    static get(req, res) {
        steamPlayer.GetOwnedGames("76561197996696153", true, true).then((games) => {
            res.status(200);
            res.send(JSON.stringify(games));
            res.end();
        });
    }
}

module.exports = Steam;
