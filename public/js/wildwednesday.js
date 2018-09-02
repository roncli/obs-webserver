/* global Power3, Winwheel */

//  #   #    #     ##        #  #   #             #                           #
//  #   #           #        #  #   #             #                           #
//  #   #   ##      #     ## #  #   #   ###    ## #  # ##    ###    ###    ## #   ###   #   #
//  # # #    #      #    #  ##  # # #  #   #  #  ##  ##  #  #   #  #      #  ##      #  #   #
//  # # #    #      #    #   #  # # #  #####  #   #  #   #  #####   ###   #   #   ####  #  ##
//  ## ##    #      #    #  ##  ## ##  #      #  ##  #   #  #          #  #  ##  #   #   ## #
//  #   #   ###    ###    ## #  #   #   ###    ## #  #   #   ###   ####    ## #   ####      #
//                                                                                      #   #
//                                                                                       ###
/**
 * A class to draw and animate the Wild Wednesday wheel.
 */
class WildWednesday {
    //    #                    ###          #           #
    //    #                    #  #                     #
    //  ###  ###    ###  #  #  #  #   ##   ##    ###   ###    ##   ###
    // #  #  #  #  #  #  #  #  ###   #  #   #    #  #   #    # ##  #  #
    // #  #  #     # ##  ####  #     #  #   #    #  #   #    ##    #
    //  ###  #      # #  ####  #      ##   ###   #  #    ##   ##   #
    /**
     * Draws the pointer.
     * @returns {void}
     */
    static drawPointer() {
        const ctx = WildWednesday.wheel.ctx;

        ctx.strokeStyle = "#000000";
        ctx.fillStyle = "#191935";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(824, 387);
        ctx.lineTo(824, 437);
        ctx.lineTo(794, 412);
        ctx.lineTo(824, 387);
        ctx.stroke();
        ctx.fill();
    }

    //   #    #           #           #              #
    //  # #                           #              #
    //  #    ##    ###   ##     ###   ###    ##    ###
    // ###    #    #  #   #    ##     #  #  # ##  #  #
    //  #     #    #  #   #      ##   #  #  ##    #  #
    //  #    ###   #  #  ###   ###    #  #   ##    ###
    /**
     * Finishes drawing the wheel.
     * @returns {void}
     */
    static finished() {
        const wheel = WildWednesday.wheel;

        for (let index = 1; index < wheel.segments.length; index++) {
            const segment = wheel.segments[index];

            segment.lineWidth = 0;
            if (segment.text !== wheel.getIndicatedSegment().text) {
                segment.fillStyle = "#000000";
                segment.text = "";
                segment.imgData = new Image();
            }
        }

        wheel.draw();
        WildWednesday.drawPointer();
    }

    //        #             #     #   ##
    //        #            # #   # #   #
    //  ###   ###   #  #   #     #     #     ##
    // ##     #  #  #  #  ###   ###    #    # ##
    //   ##   #  #  #  #   #     #     #    ##
    // ###    #  #   ###   #     #    ###    ##
    /**
     * Shuffles an array.
     * @param {[object]} array The array to shuffle.
     * @returns {[object]} The shuffled array.
     */
    static shuffle(array) {
        let currentIndex = array.length,
            temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    //         #                 #
    //         #                 #
    //  ###   ###    ###  ###   ###
    // ##      #    #  #  #  #   #
    //   ##    #    # ##  #      #
    // ###      ##   # #  #       ##
    /**
     * Starts the wheel.
     * @param {[object]} achievements The achievement list.
     * @param {[object]} gameList The game list.
     * @returns {void}
     */
    static start(achievements, gameList) {
        const games = [];
        let totalSize = 0;

        achievements.forEach((achievement) => {
            const game = gameList.find((g) => +g.appId === achievement.id);

            if (game && [517530, 450220, 314680, 366080, 205790, 367540, 2430, 35420, 443940, 570].indexOf(achievement.id) === -1 && game.playtimeTwoWeeks === 0) {
                if (achievement.percent < 100) {
                    games.push({
                        name: game.name,
                        header: `/api/proxy?url=http://cdn.akamai.steamstatic.com/steam/apps/${game.appId}/header.jpg`,
                        size: 100 - achievement.percent
                    });
                    totalSize += 100 - achievement.percent;
                }
            }
        });

        setTimeout(() => {
            WildWednesday.wheel = new Winwheel({
                canvasId: "wheel",
                numSegments: games.length,
                outerRadius: 392,
                pointerAngle: 90,
                textAlignment: "outer",
                drawMode: "segmentImage",
                drawText: true,
                imageDirection: "E",
                imageOverlay: true,
                strokeStyle: "#ffffff",
                segments: WildWednesday.shuffle(games).map((game) => ({
                    text: game.name,
                    image: game.header,
                    size: 360 * game.size / totalSize,
                    textFontFamily: "Archivo Narrow",
                    textStrokeStyle: "#ffffff",
                    textLineWidth: 1
                })),
                animation: {
                    type: "spinToStop",
                    duration: 15,
                    spins: 5,
                    easing: Power3.easeInOut,
                    callbackFinished: "WildWednesday.finished()",
                    callbackAfter: "WildWednesday.drawPointer()"
                }
            });

            setTimeout(() => {
                const img = new Image(),
                    wheel = WildWednesday.wheel;

                img.src = wheel.ctx.canvas.toDataURL();

                wheel.drawMode = "image";
                wheel.wheelImage = img;

                wheel.draw();

                wheel.startAnimation();
            }, 5000);
        }, 5000);
    }

    // ###    ##   #  #   ##                #                 #    #                    #           #
    // #  #  #  #  ####  #  #               #                 #    #                    #           #
    // #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
    // #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
    // #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
    // ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
    /**
     * Starts up the Wild Wednesday page.
     * @returns {void}
     */
    static DOMContentLoaded() {
        const x = new XMLHttpRequest();

        x.onreadystatechange = function() {
            if (x.readyState === 4 && x.status === 200) {
                const y = new XMLHttpRequest();

                y.onreadystatechange = function() {
                    if (y.readyState === 4 && y.status === 200) {
                        WildWednesday.start(JSON.parse(x.responseText), JSON.parse(y.responseText));
                    }
                };
                y.open("GET", "api/steam", true);
                y.send();
            }
        };
        x.open("GET", "api/astats", true);
        x.send();
    }
}

document.addEventListener("DOMContentLoaded", WildWednesday.DOMContentLoaded);
