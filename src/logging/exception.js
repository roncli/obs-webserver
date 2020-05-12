//  #####                               #       #
//  #                                   #
//  #      #   #   ###    ###   # ##   ####    ##     ###   # ##
//  ####    # #   #   #  #   #  ##  #   #       #    #   #  ##  #
//  #        #    #      #####  ##  #   #       #    #   #  #   #
//  #       # #   #   #  #      # ##    #  #    #    #   #  #   #
//  #####  #   #   ###    ###   #        ##    ###    ###   #   #
//                              #
//                              #
/**
 * An error class that can include an inner error.
 */
class Exception extends Error {
    //                           #                       #
    //                           #                       #
    //  ##    ##   ###    ###   ###   ###   #  #   ##   ###    ##   ###
    // #     #  #  #  #  ##      #    #  #  #  #  #      #    #  #  #  #
    // #     #  #  #  #    ##    #    #     #  #  #      #    #  #  #
    //  ##    ##   #  #  ###      ##  #      ###   ##     ##   ##   #
    /**
     * A constructor that creates the exception.
     * @param {string} message The message of the exception.
     * @param {Error} err The error object to include.
     */
    constructor(message, err) {
        super(message);

        this.innerError = err;
    }
}

module.exports = Exception;
