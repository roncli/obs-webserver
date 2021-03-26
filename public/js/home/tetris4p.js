//  #####          #              #              #   ####
//    #            #                            ##   #   #
//    #     ###   ####   # ##    ##     ###    # #   #   #
//    #    #   #   #     ##  #    #    #      #  #   ####
//    #    #####   #     #        #     ###   #####  #
//    #    #       #  #  #        #        #     #   #
//    #     ###     ##   #       ###   ####      #   #
/**
 * A class that provides functions for the Tetris 4P scene.
 */
class Tetris4P {
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
                    document.getElementById("player-1").innerText = ev.data.player1.name;
                    document.getElementById("player-2").innerText = ev.data.player2.name;
                    document.getElementById("player-3").innerText = ev.data.player3.name;
                    document.getElementById("player-4").innerText = ev.data.player4.name;
                    document.getElementById("player-1-score").innerText = ev.data.player1.score.toString();
                    document.getElementById("player-2-score").innerText = ev.data.player2.score.toString();
                    document.getElementById("player-3-score").innerText = ev.data.player3.score.toString();
                    document.getElementById("player-4-score").innerText = ev.data.player4.score.toString();
                    document.getElementById("organization").innerText = ev.data.event.organization;
                    document.getElementById("organization").style.color = `${ev.data.event.color}`;
                    document.getElementById("title").innerText = ev.data.event.title;
                    document.getElementById("title").style.color = `${ev.data.event.color}`;
                    document.getElementById("status").innerText = ev.data.event.status;
                    document.getElementById("status").style.color = `${ev.data.event.color}`;
                    break;
            }
        };
    }
}

Tetris4P.oneTwo = true;

window.Tetris4P = Tetris4P;
