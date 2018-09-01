const http = require("http");

//  ####
//  #   #
//  #   #  # ##    ###   #   #  #   #
//  ####   ##  #  #   #   # #   #   #
//  #      #      #   #    #    #  ##
//  #      #      #   #   # #    ## #
//  #      #       ###   #   #      #
//                              #   #
//                               ###
/**
 * API to retrieve a URL via proxy.
 */
class Proxy {
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
    static get(req, res) {
        http.get(req.query.url, (response) => {
            if (response.statusCode === 200) {
                res.writeHead(200, {"Content-Type": response.headers["content-type"]});
                response.pipe(res);
            } else {
                res.sendStatus(404);
            }
        });
    }
}

module.exports = Proxy;
