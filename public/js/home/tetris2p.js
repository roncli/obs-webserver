// MARK: class Tetris2P
/**
 * A class that provides functions for the Tetris 2P scene.
 */
class Tetris2P {
    // MARK: static start
    /**
     * Starts the intro scene.
     * @returns {void}
     */
    static start() {
        window.handleMessage = (ev) => {
            switch (ev.type) {
                case "players":
                    Tetris2P.oneTwo = ev.data.oneTwo;
                    break;
                case "tetris":
                    if (Tetris2P.oneTwo) {
                        document.getElementById("left-player").innerText = ev.data.player1.name;
                        document.getElementById("right-player").innerText = ev.data.player2.name;
                        document.getElementById("left-score").innerText = ev.data.player1.score.toString();
                        document.getElementById("right-score").innerText = ev.data.player2.score.toString();
                        document.getElementById("left-text").innerText = ev.data.player1.info;
                        document.getElementById("right-text").innerText = ev.data.player2.info;
                    } else {
                        document.getElementById("left-player").innerText = ev.data.player3.name;
                        document.getElementById("right-player").innerText = ev.data.player4.name;
                        document.getElementById("left-score").innerText = ev.data.player3.score.toString();
                        document.getElementById("right-score").innerText = ev.data.player4.score.toString();
                        document.getElementById("left-text").innerText = ev.data.player3.info;
                        document.getElementById("right-text").innerText = ev.data.player4.info;
                    }

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

Tetris2P.oneTwo = true;

window.Tetris2P = Tetris2P;
