/* global config, OBSWebSocket, Spotify */

const numMatch = /[0-9]/;

//  #   #  ####   ####
//  #   #   #  #  #   #
//  ##  #   #  #  #   #   ###    ###    ###
//  # # #   #  #  ####       #  #   #  #   #
//  #  ##   #  #  # #     ####  #      #####
//  #   #   #  #  #  #   #   #  #   #  #
//  #   #  ####   #   #   ####   ###    ###
/**
 * A class of static functions for the NecroDancer race page.
 */
class NDRace {
    //                #         #           ##                #     #      #
    //                #         #          #  #               #           # #
    // #  #  ###    ###   ###  ###    ##    #    ###    ##   ###   ##     #    #  #
    // #  #  #  #  #  #  #  #   #    # ##    #   #  #  #  #   #     #    ###   #  #
    // #  #  #  #  #  #  # ##   #    ##    #  #  #  #  #  #   #     #     #     # #
    //  ###  ###    ###   # #    ##   ##    ##   ###    ##     ##  ###    #      #
    //       #                                   #                              #
    /**
     * Updates the specified div and image elements with information from Spotify at the specified interval.
     * @param {[string]} elements The text element to update with the song title.
     * @param {number} interval The interval in milliseconds to update the information.
     * @returns {Promise} A promise that resolves when Spotify is updated.
     */
    static async updateSpotify(elements, interval) {
        let thisInterval;

        try {
            const response = await Spotify.readSpotify();

            if (response.playing) {
                elements.forEach((el) => {
                    document.querySelector(el).innerText = `Now Playing:\n${response.artist}\n${response.title}`;
                });
                thisInterval = Math.min(1000 + response.duration - response.progress || interval, interval);
            } else {
                elements.forEach((el) => {
                    document.querySelector(el).innerText = "";
                });
                thisInterval = void 0;
            }
        } finally {
            setTimeout(() => {
                NDRace.updateSpotify(elements, interval);
            }, thisInterval || interval);
        }
    }

    //          #         ##    ##    #                 #
    //          #        #  #  #  #   #                 #
    // ###    ###   ##    ##    #    ###    ###  ###   ###
    // #  #  #  #  #     #  #    #    #    #  #  #  #   #
    // #  #  #  #  #     #  #  #  #   #    # ##  #      #
    // #  #   ###   ##    ##    ##     ##   # #  #       ##
    /**
     * Starts the carousel.
     * @param {object} results The data provided by the API.
     * @returns {void}
     */
    static ndc8Start(results) {
        NDRace.delay = 20000;
        NDRace.status = 0;
        NDRace.index = 0;
        NDRace.data = results.races;
        NDRace.tiers = results.tiers;

        NDRace.ndc8Next();
    }

    //          #         ##   #  #               #    ###                      ##     #
    //          #        #  #  ## #               #    #  #                      #     #
    // ###    ###   ##    ##   ## #   ##   #  #  ###   #  #   ##    ###   #  #   #    ###    ###
    // #  #  #  #  #     #  #  # ##  # ##   ##    #    ###   # ##  ##     #  #   #     #    ##
    // #  #  #  #  #     #  #  # ##  ##     ##    #    # #   ##      ##   #  #   #     #      ##
    // #  #   ###   ##    ##   #  #   ##   #  #    ##  #  #   ##   ###     ###  ###     ##  ###
    /**
     * Displays the next results page.
     * @returns {void}
     */
    static ndc8NextResults() {
        const resultCount = NDRace.data.previousResults.length;

        if (resultCount > 0) {
            const $tbody = document.querySelector("#season-8 .results tbody");
            let ix, result;

            document.querySelector("#season-8 .results").classList.remove("hidden");
            document.querySelector("#season-8 .upcoming").classList.add("hidden");

            while ($tbody.firstChild) {
                $tbody.removeChild($tbody.firstChild);
            }

            for (ix = NDRace.index; ix < NDRace.index + 20 && ix < NDRace.data.previousResults.length; ix++) {
                result = NDRace.data.previousResults[ix];

                const row = document.createElement("tr");
                let node;

                node = document.createElement("td");
                node.classList.add(NDRace.tiers[result.player1.toLowerCase()]);
                node.innerText = result.player1 || "";
                row.appendChild(node);

                node = document.createElement("td");
                node.classList.add(NDRace.tiers[result.player2.toLowerCase()]);
                node.innerText = result.player2 || "";
                row.appendChild(node);

                node = document.createElement("td");
                node.innerText = result.dateStr || "";
                row.appendChild(node);

                node = document.createElement("td");
                node.innerText = `${result.score}${(result.winner ? ` ${result.winner}` : "")}`;
                row.appendChild(node);

                $tbody.appendChild(row);
            }
        }

        if (NDRace.data.previousResults.length > NDRace.index + 20) {
            NDRace.index += 20;
        } else {
            NDRace.index = 0;
            NDRace.status = 1;
        }

        if (resultCount > 0) {
            NDRace.statsTimeout = setTimeout(NDRace.ndc8Next, NDRace.delay);
        } else {
            NDRace.ndc8Next();
        }
    }

    //          #         ##   #  #               #    #  #                           #
    //          #        #  #  ## #               #    #  #
    // ###    ###   ##    ##   ## #   ##   #  #  ###   #  #  ###    ##    ##   # #   ##    ###    ###
    // #  #  #  #  #     #  #  # ##  # ##   ##    #    #  #  #  #  #     #  #  ####   #    #  #  #  #
    // #  #  #  #  #     #  #  # ##  ##     ##    #    #  #  #  #  #     #  #  #  #   #    #  #   ##
    // #  #   ###   ##    ##   #  #   ##   #  #    ##   ##   ###    ##    ##   #  #  ###   #  #  #
    //                                                       #                                    ###
    /**
     * Displays the next upcoming matches page.
     * @returns {void}
     */
    static ndc8NextUpcoming() {
        const upcomingCount = NDRace.data.upcomingMatches.length;

        if (upcomingCount > 0) {
            const $tbody = document.querySelector("#season-8 .upcoming tbody");
            let ix, match;

            document.querySelector("#season-8 .results").classList.add("hidden");
            document.querySelector("#season-8 .upcoming").classList.remove("hidden");

            while ($tbody.firstChild) {
                $tbody.removeChild($tbody.firstChild);
            }

            for (ix = NDRace.index; ix < NDRace.index + 20 && ix < NDRace.data.upcomingMatches.length; ix++) {
                match = NDRace.data.upcomingMatches[ix];

                const row = document.createElement("tr");
                let node;

                node = document.createElement("td");
                node.classList.add(NDRace.tiers[match.player1.toLowerCase()]);
                node.innerText = match.player1 || "";
                row.appendChild(node);

                node = document.createElement("td");
                node.classList.add(NDRace.tiers[match.player2.toLowerCase()]);
                node.innerText = match.player2 || "";
                row.appendChild(node);

                node = document.createElement("td");
                node.innerText = match.dateStr || "";
                row.appendChild(node);

                node = document.createElement("td");
                node.innerText = match.cawmentary || "";
                row.appendChild(node);

                $tbody.appendChild(row);
            }
        }

        if (NDRace.data.upcomingMatches.length > NDRace.index + 20) {
            NDRace.index += 20;
        } else {
            NDRace.index = 0;
            NDRace.status = 0;
        }

        if (upcomingCount > 0) {
            NDRace.statsTimeout = setTimeout(NDRace.ndc8Next, NDRace.delay);
        } else {
            NDRace.ndc8Next();
        }
    }

    //          #         ##   #  #               #
    //          #        #  #  ## #               #
    // ###    ###   ##    ##   ## #   ##   #  #  ###
    // #  #  #  #  #     #  #  # ##  # ##   ##    #
    // #  #  #  #  #     #  #  # ##  ##     ##    #
    // #  #   ###   ##    ##   #  #   ##   #  #    ##
    /**
     * Displays the next page.
     * @returns {void}
     */
    static ndc8Next() {
        switch (NDRace.status) {
            case 0:
                NDRace.ndc8NextResults();
                break;
            case 1:
                NDRace.ndc8NextUpcoming();
                break;
        }
    }

    //         #                 #    #  #        #                        #            #
    //         #                 #    #  #        #                        #            #
    //  ###   ###    ###  ###   ###   #  #   ##   ###    ###    ##    ##   # #    ##   ###    ###
    // ##      #    #  #  #  #   #    ####  # ##  #  #  ##     #  #  #     ##    # ##   #    ##
    //   ##    #    # ##  #      #    ####  ##    #  #    ##   #  #  #     # #   ##     #      ##
    // ###      ##   # #  #       ##  #  #   ##   ###   ###     ##    ##   #  #   ##     ##  ###
    /**
     * Starts the WebSocket connections and performs updates based on the messages received.
     * @returns {void}
     */
    static startWebsockets() {
        NDRace.ws = new WebSocket(`ws://${document.location.hostname}:${document.location.port || "80"}/ws/listen`);
        NDRace.obs = new OBSWebSocket();

        NDRace.time = 0;

        NDRace.ws.onmessage = (ev) => {
            const data = JSON.parse(ev.data),
                bumper = document.getElementById("bumper"),
                race = document.getElementById("race"),
                title = document.getElementById("title");

            switch (data.type) {
                case "obs-scene":
                    NDRace.obs.send("SetCurrentScene", {"scene-name": data.scene});
                    break;
                case "scene":
                    if (NDRace.statsTimeout) {
                        clearTimeout(NDRace.statsTimeout);
                    }

                    switch (data.scene) {
                        case "nd-countdown":
                            bumper.classList.remove("hidden");
                            race.classList.add("hidden");

                            title.innerText = `Crypt of the NecroDancer\n${data.event}\nCawmunity Cast`;

                            NDRace.setStartTime(data.time);
                            NDRace.setFinishText(data.finish);

                            if (NDRace.startTime && NDRace.startTime > new Date()) {
                                NDRace.updateCountdown();
                            }

                            document.getElementById("matchup").classList.remove("hidden");
                            document.getElementById("thanks").classList.add("hidden");
                            document.getElementById("countdown").classList.remove("hidden");

                            Spotify.playPlaylist("spotify:user:1211227601:playlist:2IU5xZkAV0ZPnhEItPTrsB", false);
                            Spotify.setSpotifyVolume(100);
                            NDRace.obs.send("SetCurrentScene", {"scene-name": "CoNDOR - Bumper"});
                            break;
                        case "nd-race":
                            bumper.classList.add("hidden");
                            race.classList.remove("hidden");

                            Spotify.setSpotifyVolume(33);
                            NDRace.obs.send("SetCurrentScene", {"scene-name": "CoNDOR - Race"});
                            break;
                        case "nd-thanks":
                            title.innerText = `Crypt of the NecroDancer\n${data.event}\nCawmunity Cast`;

                            document.getElementById("matchup").classList.add("hidden");
                            document.getElementById("thanks").classList.remove("hidden");
                            document.getElementById("countdown").classList.add("hidden");

                            bumper.classList.remove("hidden");
                            race.classList.add("hidden");

                            Spotify.setSpotifyVolume(100);
                            NDRace.obs.send("SetCurrentScene", {"scene-name": "CoNDOR - Bumper"});
                            break;
                    }

                    [].forEach.call(document.getElementsByClassName("event-stats"), (c) => c.classList.add("hidden"));
                    switch (data.stats) {
                        case "none":
                            document.getElementById("no-event").classList.remove("hidden");
                            break;
                        case "ndc8":
                            document.getElementById("no-event").classList.add("hidden");
                            document.querySelector("#season-8 .results").classList.add("hidden");
                            document.querySelector("#season-8 .upcoming").classList.add("hidden");
                            document.getElementById("season-8").classList.remove("hidden");
                            {
                                const x = new XMLHttpRequest();
                                x.onreadystatechange = function() {
                                    if (x.readyState === 4 && x.status === 200) {
                                        NDRace.ndc8Start(JSON.parse(x.responseText));
                                    }
                                };
                                x.open("GET", "api/necrodancerCondor8", true);
                                x.send();
                            }

                            break;
                        default:
                            break;
                    }
                    break;
                case "nd":
                    switch (data.action) {
                        case "player":
                            switch (data.side) {
                                case "left":
                                    document.getElementById("name1").innerText = data.name;
                                    document.getElementById("player-1").innerText = data.name;
                                    break;
                                case "right":
                                    document.getElementById("name2").innerText = data.name;
                                    document.getElementById("player-2").innerText = data.name;
                                    break;
                            }
                            document.getElementById("vs").innerText = "VS.";
                            break;
                        case "lute":
                            document.getElementById(`lute-${data.side}${data.number}`).classList.toggle("hidden");
                            break;
                        case "start-time":
                            NDRace.setStartTime(data.time);
                            break;
                        case "layout":
                            document.getElementById("background").style.backgroundImage = `url('/images/${data.layout}')`;
                            break;
                        case "finish-text":
                            NDRace.setFinishText(data.finish);
                            break;
                        case "timer-start":
                            if (!NDRace.timer) {
                                NDRace.timerStart = new Date();
                                NDRace.timer = setInterval(NDRace.updateTimer, 1);
                            }
                            break;
                        case "timer-stop":
                            if (NDRace.timer) {
                                clearInterval(NDRace.timer);

                                NDRace.time += new Date().getTime() - NDRace.timerStart.getTime();
                                NDRace.timerStart = void 0;
                                NDRace.timer = void 0;

                                NDRace.printTime("red");
                            }
                            break;
                        case "timer-reset":
                            if (NDRace.timer) {
                                clearInterval(NDRace.timer);
                            }

                            NDRace.time = 0;
                            NDRace.timerStart = void 0;
                            NDRace.timer = void 0;

                            NDRace.printTime("");
                            break;
                    }
                    break;
            }
        };

        NDRace.obs.connect(config.websocket);
    }

    //                #         #          ###    #
    //                #         #           #
    // #  #  ###    ###   ###  ###    ##    #    ##    # #    ##   ###
    // #  #  #  #  #  #  #  #   #    # ##   #     #    ####  # ##  #  #
    // #  #  #  #  #  #  # ##   #    ##     #     #    #  #  ##    #
    //  ###  ###    ###   # #    ##   ##    #    ###   #  #   ##   #
    //       #
    /**
     * Updates the timer and prints it.
     * @returns {void}
     */
    static updateTimer() {
        NDRace.printTime("green");
    }

    //              #           #    ###    #
    //                          #     #
    // ###   ###   ##    ###   ###    #    ##    # #    ##
    // #  #  #  #   #    #  #   #     #     #    ####  # ##
    // #  #  #      #    #  #   #     #     #    #  #  ##
    // ###   #     ###   #  #    ##   #    ###   #  #   ##
    // #
    /**
     * Prints the timer with the specified class.
     * @param {string} className The class name to apply to the time.
     * @returns {void}
     */
    static printTime(className) {
        const time = NDRace.time + (NDRace.timer ? new Date().getTime() - NDRace.timerStart.getTime() : 0),
            timeStr = `${new Date(time).toLocaleTimeString("en-us", {timeZone: "GMT", hour12: false})}.${new Intl.NumberFormat("en", {minimumIntegerDigits: 2, maximumFractionDigits: 0}).format(Math.floor(time % 1000 / 10))}`.replace(/^(?:0(?:0:)?)?/, ""),
            timer = document.getElementById("timer");

        timer.className = className;

        while (timer.firstChild) {
            timer.removeChild(timer.firstChild);
        }

        timeStr.split("").forEach((char) => {
            const div = document.createElement("div");

            if (numMatch.test(char)) {
                div.className = "number";
            }
            div.innerText = char;

            timer.appendChild(div);
        });
    }

    //               #     ##    #                 #    ###    #
    //               #    #  #   #                 #     #
    //  ###    ##   ###    #    ###    ###  ###   ###    #    ##    # #    ##
    // ##     # ##   #      #    #    #  #  #  #   #     #     #    ####  # ##
    //   ##   ##     #    #  #   #    # ##  #      #     #     #    #  #  ##
    // ###     ##     ##   ##     ##   # #  #       ##   #    ###   #  #   ##
    /**
     * Sets the start time for the race.
     * @param {string} time The time to start the race.
     * @returns {void}
     */
    static setStartTime(time) {
        const now = new Date();

        NDRace.startTime = new Date(`${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${time}`);

        if (NDRace.startTime < new Date()) {
            NDRace.startTime = new Date(NDRace.startTime.getTime() + 86400000);
        }
    }

    //               #    ####   #           #           #     ###                #
    //               #    #                              #      #                 #
    //  ###    ##   ###   ###   ##    ###   ##     ###   ###    #     ##   #  #  ###
    // ##     # ##   #    #      #    #  #   #    ##     #  #   #    # ##   ##    #
    //   ##   ##     #    #      #    #  #   #      ##   #  #   #    ##     ##    #
    // ###     ##     ##  #     ###   #  #  ###   ###    #  #   #     ##   #  #    ##
    /**
     * Sets the text to display when the countdown is finished.
     * @param {string} finish The text to display when the countdown is finished.
     * @returns {void}
     */
    static setFinishText(finish) {
        NDRace.finishText = finish;

        if (!NDRace.startTime || NDRace.startTime < new Date()) {
            document.getElementById("countdown").innerText = finish;
        }
    }

    //                #         #           ##                      #       #
    //                #         #          #  #                     #       #
    // #  #  ###    ###   ###  ###    ##   #      ##   #  #  ###   ###    ###   ##   #  #  ###
    // #  #  #  #  #  #  #  #   #    # ##  #     #  #  #  #  #  #   #    #  #  #  #  #  #  #  #
    // #  #  #  #  #  #  # ##   #    ##    #  #  #  #  #  #  #  #   #    #  #  #  #  ####  #  #
    //  ###  ###    ###   # #    ##   ##    ##    ##    ###  #  #    ##   ###   ##   ####  #  #
    //       #
    /**
     * Updates the countdown text.
     * @returns {void}
     */
    static updateCountdown() {
        const timeLeft = new Date(NDRace.startTime.getTime() - new Date().getTime()),
            countdown = document.getElementById("countdown");

        if (timeLeft.getTime() < 0) {
            countdown.innerText = NDRace.finishText;
            return;
        }

        countdown.innerText = timeLeft.toLocaleDateString("en-us", {timeZone: "UTC", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit"}).split(" ")[1];

        setTimeout(() => {
            NDRace.updateCountdown();
        }, timeLeft.getTime() % 1000 + 1);
    }

    // ###    ##   #  #   ##                #                 #    #                    #           #
    // #  #  #  #  ####  #  #               #                 #    #                    #           #
    // #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
    // #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
    // #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
    // ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
    /**
     * Starts up the race page.
     * @returns {void}
     */
    static DOMContentLoaded() {
        NDRace.updateSpotify(["#song-bumper", "#song-race"], 5000);
        NDRace.startWebsockets();
    }
}

document.addEventListener("DOMContentLoaded", NDRace.DOMContentLoaded);
