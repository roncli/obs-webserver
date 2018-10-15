/* global config, OBSWebSocket, Spotify */

//   ###   #                                          #
//  #   #  #                                          #
//  #   #  # ##    ###    ###   # ##   #   #   ###   ####    ###   # ##   #   #
//  #   #  ##  #  #      #   #  ##  #  #   #      #   #     #   #  ##  #  #   #
//  #   #  #   #   ###   #####  #       # #    ####   #     #   #  #      #  ##
//  #   #  ##  #      #  #      #       # #   #   #   #  #  #   #  #       ## #
//   ###   # ##   ####    ###   #        #     ####    ##    ###   #          #
//                                                                        #   #
//                                                                         ###
/**
 * A class of static functions that supports the Observatory page.
 */
class Observatory {
    //                      #  #                       ##
    //                      #  #                        #
    // ###    ##    ###   ###  #      ##    ##    ###   #
    // #  #  # ##  #  #  #  #  #     #  #  #     #  #   #
    // #     ##    # ##  #  #  #     #  #  #     # ##   #
    // #      ##    # #   ###  ####   ##    ##    # #  ###
    /**
     * Reads a local file.
     * @param {string} path The path of the file.
     * @param {boolean} base64 Whether to retrieve its Base64 representation.
     * @returns {Promise<string>} A promise that resolves with the contents of the file.
     */
    static readLocal(path, base64) {
        return new Promise((resolve, reject) => {
            const x = new XMLHttpRequest();

            x.onreadystatechange = () => {
                if (x.readyState !== 4) {
                    return;
                }

                if (x.readyState === 4 && x.status === 200) {
                    resolve(x.responseText);
                } else {
                    reject(new Error());
                }
            };
            x.open("GET", `api/local?${base64 ? "base64=true&" : ""}file=${encodeURIComponent(path)}`, true);
            x.send();
        });
    }

    //                #         #          ###    #
    //                #         #          #  #
    // #  #  ###    ###   ###  ###    ##   #  #  ##    # #
    // #  #  #  #  #  #  #  #   #    # ##  #  #   #    # #
    // #  #  #  #  #  #  # ##   #    ##    #  #   #    # #
    //  ###  ###    ###   # #    ##   ##   ###   ###    #
    //       #
    /**
     * Updates the specified div element with the text from a local path at a specified interval.
     * @param {string} element The element to update.
     * @param {string} path The local path to get the text.
     * @param {number} interval The interval in milliseconds to update the text.
     * @param {boolean} isHtml Whether this is HTML coming in.
     * @returns {Promise} A promise that resolves when the div element is updated.
     */
    static async updateDiv(element, path, interval, isHtml) {
        try {
            const responseText = await Observatory.readLocal(path, false);

            if (isHtml) {
                document.querySelector(element).innerHTML = responseText;
            } else {
                document.querySelector(element).innerText = responseText;
            }
        } finally {
            setTimeout(() => {
                Observatory.updateDiv(element, path, interval, isHtml);
            }, interval);
        }
    }

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
                Observatory.updateSpotify(elements, interval);
            }, thisInterval || interval);
        }
    }

    //                #         #          #  #   #       #
    //                #         #          #  #           #
    // #  #  ###    ###   ###  ###    ##   #  #  ##     ###   ##    ##
    // #  #  #  #  #  #  #  #   #    # ##  #  #   #    #  #  # ##  #  #
    // #  #  #  #  #  #  # ##   #    ##     ##    #    #  #  ##    #  #
    //  ###  ###    ###   # #    ##   ##    ##   ###    ###   ##    ##
    //       #
    /**
     * Updates the specified video element with the web cam feed.
     * @param {string} element The element to update.
     * @returns {Promise} A promise that returns when the video element is updated.
     */
    static async updateVideo(element) {
        const video = document.querySelector(element),
            devices = await navigator.mediaDevices.enumerateDevices(),
            {deviceId} = devices.filter((d) => d.kind === "videoinput" && d.label.startsWith("Logitech HD Pro Webcam C920"))[0];

        navigator.webkitGetUserMedia({
            video: {
                mandatory: {
                    minWidth: 1920,
                    minHeight: 1080
                },
                optional: [{sourceId: deviceId}]
            }
        }, (stream) => {
            video.srcObject = stream;
        }, (err) => {
            console.log(err);
        });
    }

    //        #                 #  #         #          #
    //        #                 ####         #          #
    //  ###   ###    ##   #  #  ####   ###  ###    ##   ###    ##    ###
    // ##     #  #  #  #  #  #  #  #  #  #   #    #     #  #  # ##  ##
    //   ##   #  #  #  #  ####  #  #  # ##   #    #     #  #  ##      ##
    // ###    #  #   ##   ####  #  #   # #    ##   ##   #  #   ##   ###
    /**
     * Shows the matches for the current round.
     * @param {number} round The round number to show matches for.
     * @returns {void}
     */
    static showMatches(round) {
        document.getElementById("text").innerText = `Round ${round}`;

        const tbody = document.querySelector("#data table tbody");

        tbody.innerHTML = "";

        if (Observatory.matches) {
            Observatory.matches.filter((m) => m.round === round).forEach((match) => {
                const row = document.createElement("tr");
                let node;

                node = document.createElement("td");
                if (match.player1 === match.winner) {
                    node.classList.add("winner");
                } else if (match.player2 === match.winner) {
                    node.classList.add("loser");
                }
                node.innerText = match.player1;
                row.appendChild(node);

                node = document.createElement("td");
                if (match.player2 === match.winner) {
                    node.classList.add("winner");
                } else if (match.player1 === match.winner) {
                    node.classList.add("loser");
                }
                node.innerText = match.player2;
                row.appendChild(node);

                node = document.createElement("td");
                node.innerText = match.score1 ? `${match.score1}-${match.score2}` : "";
                row.appendChild(node);

                node = document.createElement("td");
                node.innerText = (match.homes ? match.homes.join(", ") : match.home) || "";
                row.appendChild(node);

                tbody.appendChild(row);
            });
        }
    }

    //        #                  ##    #                   #   #
    //        #                 #  #   #                   #
    //  ###   ###    ##   #  #   #    ###    ###  ###    ###  ##    ###    ###   ###
    // ##     #  #  #  #  #  #    #    #    #  #  #  #  #  #   #    #  #  #  #  ##
    //   ##   #  #  #  #  ####  #  #   #    # ##  #  #  #  #   #    #  #   ##     ##
    // ###    #  #   ##   ####   ##     ##   # #  #  #   ###  ###   #  #  #     ###
    //                                                                     ###
    /**
     * Shows the current standings.
     * @returns {void}
     */
    static showStandings() {
        document.getElementById("text").innerText = "Standings";

        const tbody = document.querySelector("#data table tbody");

        tbody.innerHTML = "";

        if (Observatory.standings) {
            Observatory.standings.forEach((standing) => {
                const row = document.createElement("tr");
                let node;

                if (standing.player.withdrawn) {
                    row.classList.add("withdrawn");
                } else if (!standing.player.canHost) {
                    row.classList.add("unable-to-host");
                }

                node = document.createElement("td");
                node.innerText = standing.name;
                row.appendChild(node);

                node = document.createElement("td");
                node.classList.add("right");
                node.innerText = `${standing.score}`;
                row.appendChild(node);

                node = document.createElement("td");
                node.innerText = `${standing.wins}-${standing.losses}`;
                row.appendChild(node);

                node = document.createElement("td");
                node.innerText = standing.player.homes.join(", ");
                row.appendChild(node);

                tbody.appendChild(row);
            });
        }
    }

    //                #         #          ###                        #
    //                #         #          #  #                       #
    // #  #  ###    ###   ###  ###    ##   #  #   ##   #  #  ###    ###
    // #  #  #  #  #  #  #  #   #    # ##  ###   #  #  #  #  #  #  #  #
    // #  #  #  #  #  #  # ##   #    ##    # #   #  #  #  #  #  #  #  #
    //  ###  ###    ###   # #    ##   ##   #  #   ##    ###  #  #   ###
    //       #
    /**
     * Updates the round number, and automatically switches to the current round's matches.
     * @param {number} round The current round number.
     * @returns {void}
     */
    static updateRound(round) {
        Observatory.round = round;
        Observatory.showMatches(+round);
    }

    //                #         #          #  #         #          #
    //                #         #          ####         #          #
    // #  #  ###    ###   ###  ###    ##   ####   ###  ###    ##   ###
    // #  #  #  #  #  #  #  #   #    # ##  #  #  #  #   #    #     #  #
    // #  #  #  #  #  #  # ##   #    ##    #  #  # ##   #    #     #  #
    //  ###  ###    ###   # #    ##   ##   #  #   # #    ##   ##   #  #
    //       #
    /**
     * Updates a match, or adds it if not present.
     * @param {object} match The match to update or add.
     * @returns {void}
     */
    static updateMatch(match) {
        if (!Observatory.matches) {
            Observatory.matches = [];
        }

        const existingMatch = Observatory.matches.find((m) => m.player1 === match.player1 && m.player2 === match.player2 && m.round === match.round);

        if (existingMatch) {
            existingMatch.winner = match.winner;
            existingMatch.score1 = match.score1;
            existingMatch.score2 = match.score2;
            existingMatch.home = match.home;
            existingMatch.homes = match.homes;
        } else {
            Observatory.matches.push(match);
        }

        if (document.getElementById("text").innerHTML === `Round ${match.round}`) {
            Observatory.showMatches(+match.round);
        }
    }

    //                #         #           ##    #                   #   #
    //                #         #          #  #   #                   #
    // #  #  ###    ###   ###  ###    ##    #    ###    ###  ###    ###  ##    ###    ###   ###
    // #  #  #  #  #  #  #  #   #    # ##    #    #    #  #  #  #  #  #   #    #  #  #  #  ##
    // #  #  #  #  #  #  # ##   #    ##    #  #   #    # ##  #  #  #  #   #    #  #   ##     ##
    //  ###  ###    ###   # #    ##   ##    ##     ##   # #  #  #   ###  ###   #  #  #     ###
    //       #                                                                        ###
    /**
     * Updates the standings.
     * @param {object} standings The standings
     * @returns {void}
     */
    static updateStandings(standings) {
        Observatory.standings = standings;

        if (document.getElementById("text").innerHTML === "Standings") {
            Observatory.showStandings();
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
        Observatory.ws = new WebSocket(`ws://${document.location.hostname}:${document.location.port || "80"}/ws/listen`);
        Observatory.obs = new OBSWebSocket();
        Observatory.obsws = new WebSocket(config.observatoryWsUrl);

        Observatory.ws.onmessage = (ev) => {
            const data = JSON.parse(ev.data),
                bumper = document.getElementById("bumper"),
                tournament = document.getElementById("tournament");

            switch (data.type) {
                case "obs-scene":
                    Observatory.obs.setCurrentScene({"scene-name": data.scene});
                    break;
                case "scene":
                    switch (data.scene) {
                        case "obs-countdown":
                            bumper.classList.remove("hidden");
                            tournament.classList.add("hidden");

                            Observatory.setStartTime(data.time);
                            Observatory.setFinishText(data.finish);

                            if (Observatory.startTime && Observatory.startTime > new Date()) {
                                Observatory.updateCountdown();
                            }

                            document.getElementById("bumper-event").innerText = data.season;
                            document.getElementById("tournament-event").innerText = data.season;

                            document.getElementById("bumper-subevent").innerText = data.title;
                            document.getElementById("tournament-subevent").innerText = data.title;

                            Spotify.playPlaylist("spotify:user:1211227601:playlist:3ld3qI0evdqsr66HoaE0Zp", false);
                            Spotify.setSpotifyVolume(100);
                            Observatory.obs.setCurrentScene({"scene-name": "The Observatory - Bumper"});

                            break;
                        case "obs-tournament":
                            bumper.classList.add("hidden");
                            tournament.classList.remove("hidden");

                            document.getElementById("bumper-event").innerText = data.season;
                            document.getElementById("tournament-event").innerText = data.season;

                            document.getElementById("bumper-subevent").innerText = data.title;
                            document.getElementById("tournament-subevent").innerText = data.title;

                            Spotify.setSpotifyVolume(33);
                            Observatory.obs.setCurrentScene({"scene-name": "The Observatory - Tournament"});

                            break;
                        case "obs-thanks":
                            bumper.classList.remove("hidden");
                            tournament.classList.add("hidden");

                            if (Observatory.countdownTimeout) {
                                clearTimeout(Observatory.countdownTimeout);
                                delete Observatory.countdownTimeout;
                            }
                            document.getElementById("countdown").innerText = "Thanks for watching!";

                            Spotify.setSpotifyVolume(100);
                            Observatory.obs.setCurrentScene({"scene-name": "The Observatory - Bumper"});

                            break;
                    }
                    break;
                case "obs":
                    switch (data.action) {
                        case "season":
                            document.getElementById("bumper-event").innerText = data.season;
                            document.getElementById("tournament-event").innerText = data.season;
                            break;
                        case "title":
                            document.getElementById("bumper-subevent").innerText = data.title;
                            document.getElementById("tournament-subevent").innerText = data.title;
                            break;
                        case "start-time":
                            Observatory.setStartTime(data.time);
                            break;
                        case "finish-text":
                            Observatory.setFinishText(data.finish);
                            break;
                    }
                    break;
                case "display":
                    switch (data.display) {
                        case "round":
                            Observatory.showMatches(+data.round);
                            break;
                        case "standings":
                            Observatory.showStandings();
                            break;
                    }
                    break;
            }
        };

        Observatory.obsws.onmessage = (ev) => {
            const data = JSON.parse(ev.data);

            if (data.round) {
                Observatory.updateRound(data.round);
            }

            if (data.match) {
                Observatory.updateMatch(data.match);
            }

            if (data.matches) {
                data.matches.forEach((match) => {
                    Observatory.updateMatch(match);
                });
            }

            if (data.standings) {
                Observatory.updateStandings(data.standings);
            }
        };

        Observatory.obs.connect(config.websocket);
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

        Observatory.startTime = new Date(`${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${time}`);

        if (Observatory.startTime < new Date()) {
            Observatory.startTime = new Date(Observatory.startTime.getTime() + 86400000);
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
        Observatory.finishText = finish;

        if (!Observatory.startTime || Observatory.startTime < new Date()) {
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
        const timeLeft = new Date(Observatory.startTime.getTime() - new Date().getTime()),
            countdown = document.getElementById("countdown");

        if (timeLeft.getTime() < 0) {
            countdown.innerText = Observatory.finishText;
            delete Observatory.countdownTimeout;
            return;
        }

        countdown.innerText = timeLeft.toLocaleDateString("en-us", {timeZone: "UTC", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit"}).split(" ")[1];

        Observatory.countdownTimeout = setTimeout(() => {
            Observatory.updateCountdown();
        }, timeLeft.getTime() % 1000 + 1);
    }

    // ###    ##   #  #   ##                #                 #    #                    #           #
    // #  #  #  #  ####  #  #               #                 #    #                    #           #
    // #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
    // #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
    // #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
    // ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
    /**
     * Starts up the index page.
     * @returns {void}
     */
    static DOMContentLoaded() {
        Observatory.updateDiv("#hosts", "C:\\Users\\roncli\\Desktop\\roncliGaming\\The Observatory\\observatory-hosts.txt", 5000);
        Observatory.updateDiv("#standings", "C:\\Users\\roncli\\Desktop\\roncliGaming\\The Observatory\\observatory-results.txt", 5000, true);
        Observatory.updateSpotify(["#playing", "#nowPlaying"], 10000);
        Observatory.updateVideo("#video");
        Observatory.startWebsockets();
    }
}

document.addEventListener("DOMContentLoaded", Observatory.DOMContentLoaded);
