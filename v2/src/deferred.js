/**
 * @typedef {import("../types/deferredTypes")} DeferredTypes.DeferredPromise
 */

//  ####            ##                                   #
//   #  #          #  #                                  #
//   #  #   ###    #      ###   # ##   # ##    ###    ## #
//   #  #  #   #  ####   #   #  ##  #  ##  #  #   #  #  ##
//   #  #  #####   #     #####  #      #      #####  #   #
//   #  #  #       #     #      #      #      #      #  ##
//  ####    ###    #      ###   #      #       ###    ## #
/**
 * A class to create a deferred promise.
 */
class Deferred {
    //                          #

    // ###   ###    ##   # #   ##     ###    ##
    // #  #  #  #  #  #  ####   #    ##     # ##
    // #  #  #     #  #  #  #   #      ##   ##
    // ###   #      ##   #  #  ###   ###     ##
    // #
    /**
     * Creates a deferred promise.
     * @returns {DeferredTypes.DeferredPromise} The deferred promise.
     */
    static promise() {
        let res, rej;

        /** @type {DeferredTypes.DeferredPromise} */
        const promise = new Promise((resolve, reject) => {
            res = resolve;
            rej = reject;
        });

        promise.resolve = res;
        promise.reject = rej;

        return promise;
    }
}

module.exports = Deferred;
