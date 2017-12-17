//  #####    #
//    #
//    #     ##    ## #    ###
//    #      #    # # #  #   #
//    #      #    # # #  #####
//    #      #    # # #  #
//    #     ###   #   #   ###
/**
 * API to retrieve the current time.
 */
class Time {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Returns the time.
     * @param {object} req The request object.
     * @param {object} res The response object.
     * @returns {void}
     */
    static get(req, res) {
        res.status(200).send(new Date().toString());
    }
}

module.exports = Time;
