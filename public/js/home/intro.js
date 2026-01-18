// MARK: class Intro
/**
 * A class that provides functions for the intro scene.
 */
class Intro {
    // MARK: static start
    /**
     * Starts the intro scene.
     * @returns {void}
     */
    static start() {
        window.handleMessage = (ev) => {
            switch (ev.type) {
                case "phase":
                    switch (ev.phase) {
                        case "intro":
                            {
                                /** @type {HTMLVideoElement} */
                                const video = document.getElementById("video-intro");
                                video.play();
                            }
                            window.Home.stopSpotify();
                            break;
                    }
                    break;
            }
        };
    }
}

window.Intro = Intro;
