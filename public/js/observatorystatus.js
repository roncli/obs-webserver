/* global config */

//   ###   #                                          #                           ###    #             #
//  #   #  #                                          #                          #   #   #             #
//  #   #  # ##    ###    ###   # ##   #   #   ###   ####    ###   # ##   #   #  #      ####    ###   ####   #   #   ###
//  #   #  ##  #  #      #   #  ##  #  #   #      #   #     #   #  ##  #  #   #   ###    #         #   #     #   #  #
//  #   #  #   #   ###   #####  #       # #    ####   #     #   #  #      #  ##      #   #      ####   #     #   #   ###
//  #   #  ##  #      #  #      #       # #   #   #   #  #  #   #  #       ## #  #   #   #  #  #   #   #  #  #  ##      #
//   ###   # ##   ####    ###   #        #     ####    ##    ###   #          #   ###     ##    ####    ##    ## #  ####
//                                                                        #   #
//                                                                         ###
/**
 * A class of static functions that supports the Observatory status page.
 */
class ObservatoryStatus {
    //          #     #  #  #
    //          #     #  ####
    //  ###   ###   ###  ####   ##    ###    ###    ###   ###   ##
    // #  #  #  #  #  #  #  #  # ##  ##     ##     #  #  #  #  # ##
    // # ##  #  #  #  #  #  #  ##      ##     ##   # ##   ##   ##
    //  # #   ###   ###  #  #   ##   ###    ###     # #  #      ##
    //                                                    ###
    /**
     * Adds a message to the notification queue.
     * @param {string} message The message to add.
     * @returns {void}
     */
    static addMessage(message) {
        ObservatoryStatus.messages.push(message);

        if (!ObservatoryStatus.notificationStatus) {
            ObservatoryStatus.advanceNotification();
        }
    }

    //                    #    #  #         #     #      #    #                 #     #
    //                    #    ## #         #           # #                     #
    // ###    ##   #  #  ###   ## #   ##   ###   ##     #    ##     ##    ###  ###   ##     ##   ###
    // #  #  # ##   ##    #    # ##  #  #   #     #    ###    #    #     #  #   #     #    #  #  #  #
    // #  #  ##     ##    #    # ##  #  #   #     #     #     #    #     # ##   #     #    #  #  #  #
    // #  #   ##   #  #    ##  #  #   ##     ##  ###    #    ###    ##    # #    ##  ###    ##   #  #
    /**
     * Retrieves the next notification, if available, and displays it.
     * @returns {void}
     */
    static nextNotification() {
        document.getElementById("text").innerText = ObservatoryStatus.messages.shift();
    }

    //          #                                #  #         #     #      #    #                 #     #
    //          #                                ## #         #           # #                     #
    //  ###   ###  # #    ###  ###    ##    ##   ## #   ##   ###   ##     #    ##     ##    ###  ###   ##     ##   ###
    // #  #  #  #  # #   #  #  #  #  #     # ##  # ##  #  #   #     #    ###    #    #     #  #   #     #    #  #  #  #
    // # ##  #  #  # #   # ##  #  #  #     ##    # ##  #  #   #     #     #     #    #     # ##   #     #    #  #  #  #
    //  # #   ###   #     # #  #  #   ##    ##   #  #   ##     ##  ###    #    ###    ##    # #    ##  ###    ##   #  #
    /**
     * Advances to the next notification if one is available.
     * @returns {void}
     */
    static advanceNotification() {
        switch (ObservatoryStatus.notificationStatus) {
            case 1:
                document.getElementById("box").classList.add("box-anim");
                ObservatoryStatus.notificationStatus = 2;
                setTimeout(ObservatoryStatus.advanceNotification, 500);
                break;
            case 2:
                document.getElementById("text").classList.add("text-anim");
                ObservatoryStatus.notificationStatus = 3;
                setTimeout(ObservatoryStatus.advanceNotification, 10000);
                break;
            case 3:
                document.getElementById("text").classList.remove("text-anim");
                ObservatoryStatus.notificationStatus = 4;
                setTimeout(ObservatoryStatus.advanceNotification, 500);
                break;
            case 4:
                document.getElementById("box").classList.remove("box-anim");
                ObservatoryStatus.notificationStatus = 5;
                setTimeout(ObservatoryStatus.advanceNotification, 500);
                break;
            case 5:
                if (ObservatoryStatus.messages.length > 0) {
                    ObservatoryStatus.nextNotification();
                    document.getElementById("box").classList.add("box-anim");
                    ObservatoryStatus.notificationStatus = 2;
                } else {
                    document.getElementById("circle").classList.remove("circle-anim");
                    document.getElementById("logo").classList.remove("logo-anim");
                    document.getElementById("status").classList.remove("status-anim");
                    ObservatoryStatus.notificationStatus = 6;
                }
                setTimeout(ObservatoryStatus.advanceNotification, 500);
                break;
            default:
                if (ObservatoryStatus.messages.length > 0) {
                    ObservatoryStatus.nextNotification();
                    document.getElementById("circle").classList.add("circle-anim");
                    document.getElementById("logo").classList.add("logo-anim");
                    document.getElementById("status").classList.add("status-anim");
                    ObservatoryStatus.notificationStatus = 1;
                    setTimeout(ObservatoryStatus.advanceNotification, 500);
                } else {
                    ObservatoryStatus.notificationStatus = 0;
                }
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
        ObservatoryStatus.ws = new WebSocket(`ws://${document.location.hostname}:${document.location.port || "80"}/ws/listen`);
        ObservatoryStatus.obsws = new WebSocket(config.observatoryWsUrl);

        ObservatoryStatus.messages = [];

        ObservatoryStatus.ws.onmessage = (ev) => {
            const data = JSON.parse(ev.data);

            switch (data.type) {
                case "obs-scene":
                    ObservatoryStatus.obs.setCurrentScene({"scene-name": data.scene});
                    break;
                case "scene":
                    switch (data.scene) {
                        case "obs-countdown":
                            document.getElementById("logo").classList.add("bumper");
                            document.getElementById("status").classList.add("bumper");
                            break;
                        case "obs-tournament":
                            document.getElementById("logo").classList.remove("bumper");
                            document.getElementById("status").classList.remove("bumper");
                            document.getElementById("event").innerText = data.season;
                            document.getElementById("subevent").innerText = data.title;
                            break;
                        case "obs-thanks":
                            document.getElementById("logo").classList.add("bumper");
                            document.getElementById("status").classList.add("bumper");
                            break;
                    }
                    break;
                case "obs":
                    switch (data.action) {
                        case "season":
                            document.getElementById("event").innerText = data.season;
                            break;
                        case "title":
                            document.getElementById("subevent").innerText = data.title;
                            break;
                    }
                    break;
            }
        };

        ObservatoryStatus.obsws.onmessage = (ev) => {
            const data = JSON.parse(ev.data);

            if (data.round) {
                document.getElementById("round").innerText = `Round ${data.round}`;
            }

            if (data.addplayer) {
                ObservatoryStatus.addMessage(`${data.addplayer.name} has joined the tournament\nHome maps: ${data.addplayer.homes.join(", ")}`);
            }

            if (data.withdraw) {
                ObservatoryStatus.addMessage(`${data.withdraw} has withdrawn`);
            }

            if (data.match && data.match.winner) {
                ObservatoryStatus.addMessage(`Match completed\n${data.match.winner} ${data.match.score1}, ${data.match.player1 === data.match.winner ? data.match.player2 : data.match.player1} ${data.match.score2}, ${data.match.home}`);
            }
        };
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
        ObservatoryStatus.startWebsockets();
    }
}

document.addEventListener("DOMContentLoaded", ObservatoryStatus.DOMContentLoaded);
