const Color = require("./color"),
    settings = require("../settings"),
    WLED = require("wled").WLED,
    ws = require("ws"),

    host = settings.wled,
    leds = new WLED(host);

/** @type {Map<number, number>} */
const segments = new Map();

segments.set(1, 12);
segments.set(2, 13);
segments.set(3, 14);
segments.set(4, 15);
segments.set(5, 11);
segments.set(6, 10);
segments.set(7, 9);
segments.set(8, 8);
segments.set(9, 4);
segments.set(10, 5);
segments.set(11, 6);
segments.set(12, 7);
segments.set(13, 3);
segments.set(14, 2);
segments.set(15, 1);
segments.set(16, 0);

/** @type {ws.WebSocket} */
let lightsWs;

let openWs = false;

let waiting = false;

//  #        #           #       #
//  #                    #       #
//  #       ##     ## #  # ##   ####    ###
//  #        #    #  #   ##  #   #     #
//  #        #     ##    #   #   #      ###
//  #        #    #      #   #   #  #      #
//  #####   ###    ###   #   #    ##   ####
//                #   #
//                 ###
/**
 * A class that easily sets lighting on the gaming wall.
 */
class Lights {
    //  #           #     #    #  #
    //                    #    #  #
    // ##    ###   ##    ###   #  #   ###
    //  #    #  #   #     #    ####  ##
    //  #    #  #   #     #    ####    ##
    // ###   #  #  ###     ##  #  #  ###
    /**
     * Initializes the websocket for wled.
     * @returns {void}
     */
    static initWs() {
        lightsWs = new ws.WebSocket(`ws://${host}/ws`, {});
        lightsWs.on("open", () => {
            openWs = true;
        });

        lightsWs.on("close", () => {
            openWs = false;
            try {
                lightsWs.close();
            } catch {}
            setTimeout(Lights.initWs, 10000);
        });

        lightsWs.on("error", () => {
            openWs = false;
            try {
                lightsWs.close();
            } catch {}
        });
    }

    //                           #                       #
    //                           #                       #
    //  ##    ##   ###    ###   ###   ###   #  #   ##   ###    ##   ###
    // #     #  #  #  #  ##      #    #  #  #  #  #      #    #  #  #  #
    // #     #  #  #  #    ##    #    #     #  #  #      #    #  #  #
    //  ##    ##   #  #  ###      ##  #      ###   ##     ##   ##   #
    /**
     * Creates a new instance of lights.
     * @param {boolean} [useWs] Whether to use websockets.
     */
    constructor(useWs) {
        /** @type {Map<number, Color>} The set of lights for this instance. */
        this.lights = new Map();
        this.reset();
        this.useWs = useWs;

        if (useWs) {
            if (!lightsWs) {
                Lights.initWs();
            }
        }
    }

    //  #    ##    ##                 #                 #
    //        #     #                                   #
    // ##     #     #    #  #  # #   ##    ###    ###  ###    ##
    //  #     #     #    #  #  ####   #    #  #  #  #   #    # ##
    //  #     #     #    #  #  #  #   #    #  #  # ##   #    ##
    // ###   ###   ###    ###  #  #  ###   #  #   # #    ##   ##
    /**
     * Illuminates the gaming wall with the current set of lights.
     * @returns {Promise} A promise that resolves when the illumination is complete.
     */
    async illuminate() {
        if (waiting) {
            return;
        }

        while (this.useWs && !openWs) {
            waiting = true;
            await new Promise((resolve) => {
                setTimeout(resolve, 100);
            });
        }
        waiting = false;

        const lights = [];

        for (let segment = 1; segment <= 16; segment++) {
            const currentSegment = segments.get(segment);
            lights.push(...[currentSegment * 9, currentSegment * 9 + 9, this.lights.get(segment).toArray()]);
        }

        if (this.useWs) {
            lightsWs.send(JSON.stringify({seg: [{i: lights}]}));
        } else {
            try {
                await leds.setLedColor(lights);
            } catch {}
        }
    }

    //                           #
    //                           #
    // ###    ##    ###    ##   ###
    // #  #  # ##  ##     # ##   #
    // #     ##      ##   ##     #
    // #      ##   ###     ##     ##
    /**
     * Resets all lights to black.
     * @returns {void}
     */
    reset() {
        this.lights.set(1, new Color(0, 0, 0));
        this.lights.set(2, new Color(0, 0, 0));
        this.lights.set(3, new Color(0, 0, 0));
        this.lights.set(4, new Color(0, 0, 0));
        this.lights.set(5, new Color(0, 0, 0));
        this.lights.set(6, new Color(0, 0, 0));
        this.lights.set(7, new Color(0, 0, 0));
        this.lights.set(8, new Color(0, 0, 0));
        this.lights.set(9, new Color(0, 0, 0));
        this.lights.set(10, new Color(0, 0, 0));
        this.lights.set(11, new Color(0, 0, 0));
        this.lights.set(12, new Color(0, 0, 0));
        this.lights.set(13, new Color(0, 0, 0));
        this.lights.set(14, new Color(0, 0, 0));
        this.lights.set(15, new Color(0, 0, 0));
        this.lights.set(16, new Color(0, 0, 0));
    }

    //               #
    //               #
    //  ###    ##   ###
    // ##     # ##   #
    //   ##   ##     #
    // ###     ##     ##
    /**
     * Sets a lighting segment to a specific color.
     * @param {number} segment The segment.
     * @param {Color} color The color.
     * @returns {void}
     */
    set(segment, color) {
        this.lights.set(segment, color);
    }
}

module.exports = Lights;
