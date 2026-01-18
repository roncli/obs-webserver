/**
 * @callback QueuedFunction
 * @returns {void | PromiseLike<void>}
 */

// MARK: Queue
/**
 * A class that creates a queue of functions.
 */
class Queue {
    // MARK: constructor
    /**
     * Creates a new queue.
     */
    constructor() {
        this.promise = Promise.resolve();
        this.queued = 0;
        this.complete = 0;
    }

    // MARK: push
    /**
     * Adds a function to the queue.
     * @param {QueuedFunction} fx The function to add to the queue.
     * @returns {void}
     */
    push(fx) {
        const queue = this;

        this.queued++;
        this.promise = this.promise.then(() => {}).catch(() => {}).then(async () => {
            await fx();
            queue.complete++;

            if (queue.complete === queue.queued) {
                queue.promise = Promise.resolve();
            }
        });
    }
}

module.exports = Queue;
