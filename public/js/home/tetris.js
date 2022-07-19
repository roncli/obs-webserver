//  #####          #              #
//    #            #
//    #     ###   ####   # ##    ##     ###
//    #    #   #   #     ##  #    #    #
//    #    #####   #     #        #     ###
//    #    #       #  #  #        #        #
//    #     ###     ##   #       ###   ####
/**
 * A class that provides functions for the Tetris 2P scene.
 */
class Tetris {
    //         #                 #
    //         #                 #
    //  ###   ###    ###  ###   ###
    // ##      #    #  #  #  #   #
    //   ##    #    # ##  #      #
    // ###      ##   # #  #       ##
    /**
     * Starts the intro scene.
     * @returns {void}
     */
    static start() {
        window.handleMessage = (ev) => {
            switch (ev.type) {
                case "tetris":
                    document.getElementById("organization").innerText = ev.data.event.organization;
                    document.getElementById("organization").style.color = `${ev.data.event.color}`;
                    document.getElementById("title").innerText = ev.data.event.title;
                    document.getElementById("title").style.color = `${ev.data.event.color}`;
                    break;
            }
        };

        // Setup themes.
        for (let i = 0; i < 10; i++) {
            if (i === 9) {
                window.BlockrainThemes[`level${i}`] = {
                    complexBlocks: {
                        line: `/images/blockrain/level${i}-ctm/i.png`,
                        square: `/images/blockrain/level${i}-ctm/o.png`,
                        arrow: `/images/blockrain/level${i}-ctm/t.png`,
                        rightHook: `/images/blockrain/level${i}-ctm/l.png`,
                        leftHook: `/images/blockrain/level${i}-ctm/j.png`,
                        rightZag: `/images/blockrain/level${i}-ctm/s.png`,
                        leftZag: `/images/blockrain/level${i}-ctm/z.png`
                    }
                };
            } else {
                window.BlockrainThemes[`level${i}`] = {
                    complexBlocks: {
                        line: `/images/blockrain/level${i}/i.png`,
                        square: `/images/blockrain/level${i}/o.png`,
                        arrow: `/images/blockrain/level${i}/t.png`,
                        rightHook: `/images/blockrain/level${i}/l.png`,
                        leftHook: `/images/blockrain/level${i}/j.png`,
                        rightZag: `/images/blockrain/level${i}/s.png`,
                        leftZag: `/images/blockrain/level${i}/z.png`
                    }
                };
            }
        }

        // Start game.
        let totalLines = 0,
            level = 0,
            score = 0;

        const game = window.$("#tetris #tetris-game").blockrain({
            autoplay: true,
            autoplayRestart: true,
            speed: 100,
            autoBlockWidth: true,
            autoBlockSize: 64,
            theme: "level0",
            onLine: (lines) => {
                totalLines += lines;

                // Level transition every 10 lines.
                if (Math.floor(totalLines / 10) !== level) {
                    level = Math.floor(totalLines / 10);
                    game.blockrain("theme", `level${level % 10}`);
                }

                // Update score.
                switch (lines) {
                    case 1:
                        score += 40 * (level + 1);
                        break;
                    case 2:
                        score += 100 * (level + 1);
                        break;
                    case 3:
                        score += 300 * (level + 1);
                        break;
                    case 4:
                        score += 1200 * (level + 1);
                        break;
                }

                game.blockrain("score", score);

                document.getElementsByClassName("blockrain-score-num")[0].innerText = score;
            },
            onRestart: () => {
                totalLines = 0;
                level = 0;
                score = 0;
                game.blockrain("theme", "level0");
            }
        });
    }
}

window.Tetris = Tetris;
