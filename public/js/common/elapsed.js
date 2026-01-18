// MARK: class Elapsed
/**
 * A class that represents an elapsed timer.
 */
class Elapsed {
    // MARK: constructor
    /**
     * Creates a new elapsed timer instance.
     * @param {DateTime} start The start of the Elapsed.
     * @param {Element} [el] The element to write to.
     */
    constructor(start, el) {
        this.start = start;
        this.id = ++Elapsed.id;

        if (el) {
            el.innerHTML = `<span id="elapsed-${this.id}"></span>`;
        } else {
            document.write(`<span id="elapsed-${this.id}"></span>`);
        }

        this.update();
    }

    // MARK: update
    /**
     * Updates the timer.
     * @returns {void}
     */
    update() {
        const elapsed = document.getElementById(`elapsed-${this.id}`);

        if (!elapsed) {
            return;
        }

        const difference = new Date().getTime() - this.start.getTime(),
            hours = Math.floor(Math.abs(difference) / (60 * 60 * 1000));

        elapsed.innerText = `${hours < 10 ? "0" : ""}${hours}:${new Date(difference).toLocaleString("en-US", {timeZone: "GMT", minute: "2-digit", second: "2-digit", hourCycle: "h23"})}`;

        setTimeout(() => {
            this.update();
        }, 1001 - difference % 1000);
    }
}

Elapsed.id = 0;

window.Elapsed = Elapsed;
