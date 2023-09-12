const Color = require("./color"),
    Lights = require("./lights");

//  #        #           #       #       #
//  #                    #       #
//  #       ##     ## #  # ##   ####    ##    # ##    ## #
//  #        #    #  #   ##  #   #       #    ##  #  #  #
//  #        #     ##    #   #   #       #    #   #   ##
//  #        #    #      #   #   #  #    #    #   #  #
//  #####   ###    ###   #   #    ##    ###   #   #   ###
//                #   #                              #   #
//                 ###                                ###
/**
 * A class that handles lighting for the scenes.
 */
class Lighting {
    //              #                 #
    //                                #
    //  ###  ###   ##    # #    ###  ###    ##
    // #  #  #  #   #    ####  #  #   #    # ##
    // # ##  #  #   #    #  #  # ##   #    ##
    //  # #  #  #  ###   #  #   # #    ##   ##
    /**
     * Animates the current lighting.
     * @returns {Promise} A promise that resolves when the current lighting is animated.
     */
    static async animate() {
        Lighting.data.step++;
        Lighting.data.lights[Lighting.data.currentLights].animation(Lighting.data.step);
        await Lighting.data.lights[Lighting.data.currentLights].lights.illuminate();
        if (Lighting.data.lights[Lighting.data.currentLights].animationDelay) {
            Lighting.data.lightsTimeout = setTimeout(Lighting.animate, Lighting.data.lights[Lighting.data.currentLights].animationDelay);
        }
    }

    //         #                 #     ##          #                 #     #
    //         #                 #    #  #                           #
    //  ###   ###    ###  ###   ###   #  #  ###   ##    # #    ###  ###   ##     ##   ###
    // ##      #    #  #  #  #   #    ####  #  #   #    ####  #  #   #     #    #  #  #  #
    //   ##    #    # ##  #      #    #  #  #  #   #    #  #  # ##   #     #    #  #  #  #
    // ###      ##   # #  #       ##  #  #  #  #  ###   #  #   # #    ##  ###    ##   #  #
    /**
     * Starts animation for the current lighting setup.
     * @returns {void}
     */
    static startAnimation() {
        Lighting.data.step = 0;
        Lighting.data.lightsTimeout = setTimeout(Lighting.animate, 1);
    }

    //         #                 ##          #                 #     #
    //         #                #  #                           #
    //  ###   ###    ##   ###   #  #  ###   ##    # #    ###  ###   ##     ##   ###
    // ##      #    #  #  #  #  ####  #  #   #    ####  #  #   #     #    #  #  #  #
    //   ##    #    #  #  #  #  #  #  #  #   #    #  #  # ##   #     #    #  #  #  #
    // ###      ##   ##   ###   #  #  #  #  ###   #  #   # #    ##  ###    ##   #  #
    //                    #
    /**
     * Stops animation for the current lighting setup.
     * @returns {void}
     */
    static stopAnimation() {
        if (Lighting.data.lightsTimeout) {
            clearTimeout(Lighting.data.lightsTimeout);
        }
        Lighting.data.lightsTimeout = void 0;
    }
}

/** @type {{currentLights: string, lightsTimeout: NodeJS.Timeout, step: number, lights: {[x: string]: {lights: Lights, animation: Function, animationDelay: number}}}} */
Lighting.data = {
    currentLights: "main",
    lightsTimeout: void 0,
    step: 0,
    lights: {
        main: {
            lights: new Lights(),
            animation: () => {},
            animationDelay: 0
        },
        fire: {
            lights: new Lights(true),
            animation: () => {
                for (let i = 1; i <= 16; i++) {
                    Lighting.data.lights.fire.lights.set(i, new Color(255, Math.floor(256 * Math.random()), 0));
                }
            },
            animationDelay: 250
        },
        alert: {
            lights: new Lights(true),
            animation: (/** @type {number} */step) => {
                let startSegment = 0;

                switch (step % 4) {
                    case 0:
                        startSegment = 4;
                        break;
                    case 1:
                        startSegment = 0;
                        break;
                    case 2:
                        startSegment = 1;
                        break;
                    case 3:
                        startSegment = 5;
                        break;
                }

                Lighting.data.lights.fire.lights.reset();
                Lighting.data.lights.fire.lights.set(1 + startSegment, new Color(40, 40, 106));
                Lighting.data.lights.fire.lights.set(2 + startSegment, new Color(40, 40, 106));
                Lighting.data.lights.fire.lights.set(3 + startSegment, new Color(40, 40, 106));
                Lighting.data.lights.fire.lights.set(5 + startSegment, new Color(30, 30, 80));
                Lighting.data.lights.fire.lights.set(6 + startSegment, new Color(30, 30, 80));
                Lighting.data.lights.fire.lights.set(9 + startSegment, new Color(20, 20, 53));
                Lighting.data.lights.fire.lights.set(11 + startSegment, new Color(20, 20, 53));
            },
            animationDelay: 500
        }
    }
};

// Initialize the main lighting with the showcase lighting.
Lighting.data.lights.main.lights.set(1, new Color(235, 235, 235));
Lighting.data.lights.main.lights.set(2, new Color(128, 0, 128));
Lighting.data.lights.main.lights.set(3, new Color(135, 215, 246));
Lighting.data.lights.main.lights.set(4, new Color(135, 215, 246));
Lighting.data.lights.main.lights.set(5, new Color(2, 191, 2));
Lighting.data.lights.main.lights.set(6, new Color(2, 191, 2));
Lighting.data.lights.main.lights.set(7, new Color(145, 70, 255));
Lighting.data.lights.main.lights.set(8, new Color(145, 70, 255));
Lighting.data.lights.main.lights.set(9, new Color(68, 106, 151));
Lighting.data.lights.main.lights.set(10, new Color(238, 28, 37));
Lighting.data.lights.main.lights.set(11, new Color(245, 140, 186));
Lighting.data.lights.main.lights.set(12, new Color(0, 180, 255));
Lighting.data.lights.main.lights.set(13, new Color(255, 231, 87));
Lighting.data.lights.main.lights.set(14, new Color(238, 28, 37));
Lighting.data.lights.main.lights.set(15, new Color(0, 113, 206));
Lighting.data.lights.main.lights.set(16, new Color(0, 113, 206));

module.exports = Lighting;
