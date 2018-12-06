const request = require("request"),
    {promisify} = require("util"),
    {JSDOM} = require("jsdom"),
    $ = require("jquery")(new JSDOM().window),
    steamGameInfoMatch = /Steam_Game_Info\.php\?Tab=2&AppID=(\d+)&/;

//    #            #             #
//   # #           #             #
//  #   #   ###   ####    ###   ####    ###
//  #   #  #       #         #   #     #
//  #####   ###    #      ####   #      ###
//  #   #      #   #  #  #   #   #  #      #
//  #   #  ####     ##    ####    ##   ####
/**
 * API to retrieve stats from astats.
 */
class Astats {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Returns stats from Astats.
     * @param {object} req The request object.
     * @param {object} res The response object.
     * @returns {void}
     */
    static async get(req, res) {
        try {
            const response = await promisify(request)("http://astats.astats.nl/astats/User_Games.php?SteamID64=76561197996696153&DisplayType=1&AchievementsOnly=1");

            if (!response || !response.body) {
                res.sendStatus(500);
                return;
            }

            const body = `<div>${response.body.replace(/^[\s\S]*<body.*?>|<\/body>[\s\S]*$/ig, "")}</div>`;

            res.status(200);
            res.send(JSON.stringify($.makeArray($($(body).find("table")[1]).find("tbody tr").map((index, el) => {
                const $el = $(el);
                return {id: +steamGameInfoMatch.exec($($el.find("td")[0]).find("a").attr("href"))[1], percent: +$($el.find("td")[5]).text().replace("%", "")};
            }))));
            res.end();
        } catch (err) {
            res.sendStatus(500);
            console.log(err);
        }
    }
}

module.exports = Astats;
