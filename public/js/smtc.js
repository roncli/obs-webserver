/**
 * @typedef {import("../../types/smtcTypes").Track} SMTCTypes.Track
 */

// MARK: class SMTC
/**
 * A class of static functions to control SMTC.
 */
class SMTC {
    // MARK: static readSMTC
    /**
     * Reads now playing information from SMTC.
     * @returns {Promise<SMTCTypes.Track>} A promise that resolves with the SMTC information.
     */
    static readSMTC() {
        return new Promise((resolve, reject) => {
            const x = new XMLHttpRequest();

            x.timeout = 5000;
            x.onreadystatechange = function() {
                if (x.readyState !== 4) {
                    return;
                }

                if (x.readyState === 4 && x.status === 200) {
                    resolve(JSON.parse(x.responseText));
                } else {
                    reject(new Error());
                }
            };

            x.ontimeout = function() {
                reject(new Error());
            };

            x.onerror = function() {
                reject(new Error());
            };

            x.open("GET", "api/smtc/now-playing", true);
            x.send();
        });
    }
}

window.SMTC = SMTC;
