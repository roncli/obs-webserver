/**
 * @typedef {import("../types/deferredTypes")} DeferredTypes.DeferredPromise
 */

// MARK: class Deferred
/**
 * A class to create a deferred promise.
 */
class Deferred {
    // MARK: static promise
    /**
     * Creates a deferred promise.
     * @returns {DeferredTypes.DeferredPromise} The deferred promise.
     */
    static promise() {
        let res, rej;

        let isFulfilled = false;
        let isPending = true;
        let isRejected = false;

        /** @type {DeferredTypes.DeferredPromise} */
        const promise = new Promise((resolve, reject) => {
            res = resolve;
            rej = reject;
        }).then((value) => {
            isFulfilled = true;
            isPending = false;
            return value;
        }).catch((err) => {
            isRejected = true;
            isPending = false;
            throw err;
        });

        promise.resolve = res;
        promise.reject = rej;
        promise.isFulfilled = () => isFulfilled;
        promise.isPending = () => isPending;
        promise.isRejected = () => isRejected;

        return promise;
    }
}

module.exports = Deferred;
