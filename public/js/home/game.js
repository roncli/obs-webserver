//   ###
//  #   #
//  #       ###   ## #    ###
//  #          #  # # #  #   #
//  #  ##   ####  # # #  #####
//  #   #  #   #  # # #  #
//   ###    ####  #   #   ###
/**
 * A class that provides functions for the game scene.
 */
class Game {
    //                     #
    //                     #
    //  ##    ##    ###   ###
    // #     #  #  ##      #
    // #     #  #    ##    #
    //  ##    ##   ###      ##
    /**
     * Gets the byte cost for a value.
     * @param {number} bytes The number of bytes.
     * @returns {string} The byte cost.
     */
    static cost(bytes) {
        const format = Intl.NumberFormat().format;

        if (bytes < 1024) {
            return `${format(bytes)} Bytes`;
        } else if (bytes < 1024 * 1024) {
            return `${format(Math.floor(bytes / 1024))} Kilobytes`;
        } else if (bytes < 1024 * 1024 * 1024) {
            return `${format(Math.floor(bytes / (1024 * 1024)))} Megabytes`;
        } else if (bytes < 1024 * 1024 * 1024 * 1024) {
            return `${format(Math.floor(bytes / (1024 * 1024 * 1024)))} Gigabytes`;
        }

        return `${format(Math.floor(bytes / (1024 * 1024 * 1024 * 1024)))} Terabytes`;
    }

    //              #    ###    #                #  #
    //              #     #                      ## #
    //  ###   ##   ###    #    ##     ##   ###   ## #   ###  # #    ##
    // #  #  # ##   #     #     #    # ##  #  #  # ##  #  #  ####  # ##
    //  ##   ##     #     #     #    ##    #     # ##  # ##  #  #  ##
    // #      ##     ##   #    ###    ##   #     #  #   # #  #  #   ##
    //  ###
    /**
     * Gets the tier name based on the data from the Twitch API.
     * @param {string} tier The tier from the Twitch API.
     * @param {boolean} isPrime Whether the sub is a Prime sub.
     * @returns {string} The tier name.
     */
    static getTierName(tier, isPrime) {
        switch (tier) {
            case "2000":
                return "Firebomber";
            case "3000":
                return "Pyromaniac";
            case "Prime":
            case "1000":
            default:
                return `${isPrime || tier === "Prime" ? "Prime " : ""}Demolitionist`;
        }
    }

    //              #     #      #
    //              #           # #
    // ###    ##   ###   ##     #    #  #
    // #  #  #  #   #     #    ###   #  #
    // #  #  #  #   #     #     #     # #
    // #  #   ##     ##  ###    #      #
    //                                #
    /**
     * Start a notification.
     * @param {string} image The image for the notification.
     * @param {string} sound The sound to use for the notification.
     * @param {string} html The HTML of the notification.
     * @returns {void}
     */
    static notify(image, sound, html) {
        const notification = document.getElementById("notification"),
            support = document.getElementById("support"),
            recent = document.getElementById("recent");

        let timeout = 1;

        if (Game.notifyTimeout) {
            notification.innerHTML = "";
            notification.classList.remove("ease-in");
            notification.classList.remove("fade-out");
            clearTimeout(Game.notifyTimeout);
        } else {
            if (support) {
                support.classList.add("fade-out");
            }
            if (recent) {
                recent.classList.add("fade-out");
            }
            timeout = 500;
        }

        Game.notifyTimeout = setTimeout(() => {
            notification.innerHTML = window.GameNotificationView.get(image, sound, html);
            notification.classList.add("ease-in");

            Game.notifyTimeout = setTimeout(() => {
                notification.classList.remove("ease-in");
                notification.classList.add("fade-out");

                Game.notifyTimeout = setTimeout(() => {
                    if (support) {
                        support.innerHTML = window.GameSupportView.get();
                    }
                    if (recent) {
                        recent.innerHTML = window.GameRecentView.get();
                    }
                    notification.innerHTML = "";
                    if (support) {
                        support.classList.remove("fade-out");
                    }
                    if (recent) {
                        recent.classList.remove("fade-out");
                    }
                    notification.classList.remove("fade-out");

                    Game.notifyTimeout = void 0;
                }, 500);
            }, 10000);
        }, timeout);
    }

    //         #                 #
    //         #                 #
    //  ###   ###    ###  ###   ###
    // ##      #    #  #  #  #   #
    //   ##    #    # ##  #      #
    // ###      ##   # #  #       ##
    /**
     * Starts the game scene.
     * @returns {void}
     */
    static start() {
        if (window.Home.data.elapsedStart) {
            new window.Elapsed(window.Home.data.elapsedStart, document.getElementById("elapsed"));
        }

        window.handleMessage = (ev) => {
            const format = Intl.NumberFormat().format;

            switch (ev.type) {
                case "settings":
                    switch (ev.data.type) {
                        case "roncliGaming":
                            document.getElementById("title").innerHTML = window.GameTitleView.get(ev.data.data.title);
                            if (document.getElementById("info")) {
                                document.getElementById("info").innerHTML = window.GameInfoView.get(ev.data.data.info);
                            }
                            if (document.getElementById("analysis-info")) {
                                document.getElementById("analysis-info").innerHTML = window.GameInfoView.get(ev.data.data.analysis);
                            }
                            if (document.getElementById("player-1")) {
                                document.getElementById("player-1").innerHTML = window.Common.htmlEncode(ev.data.data.player1);
                            }
                            if (document.getElementById("twitch-1")) {
                                document.getElementById("twitch-1").innerHTML = window.Common.htmlEncode(ev.data.data.twitch1);
                            }
                            if (document.getElementById("score-1")) {
                                document.getElementById("score-1").innerHTML = window.Common.htmlEncode(ev.data.data.score1);
                            }
                            if (document.getElementById("units-1")) {
                                document.getElementById("units-1").innerHTML = window.Common.htmlEncode(ev.data.data.units);
                            }
                            if (document.getElementById("player-2")) {
                                document.getElementById("player-2").innerHTML = window.Common.htmlEncode(ev.data.data.player2);
                            }
                            if (document.getElementById("twitch-2")) {
                                document.getElementById("twitch-2").innerHTML = window.Common.htmlEncode(ev.data.data.twitch2);
                            }
                            if (document.getElementById("score-2")) {
                                document.getElementById("score-2").innerHTML = window.Common.htmlEncode(ev.data.data.score2);
                            }
                            if (document.getElementById("units-2")) {
                                document.getElementById("units-2").innerHTML = window.Common.htmlEncode(ev.data.data.units);
                            }
                            break;
                    }
                    break;
                case "updateSpotify":
                    {
                        const lastTrack = ev.track ? JSON.stringify({
                            artist: ev.track.artist,
                            title: ev.track.title,
                            imageUrl: ev.track.imageUrl
                        }) : void 0;

                        if (lastTrack !== Game.lastTrack) {
                            document.getElementById("spotify").innerHTML = window.SpotifyView.get(ev.track);
                        }

                        Game.lastTrack = lastTrack;
                    }
                    break;
                case "clearSpotify":
                    document.getElementById("spotify").innerHTML = "";
                    break;
                case "elapsed":
                    window.Home.data.elapsedStart = new Date();
                    new window.Elapsed(window.Home.data.elapsedStart, document.getElementById("elapsed"));
                    break;
                case "banner": {
                    const banner = document.getElementById("banner");

                    if (banner) {
                        banner.style.backgroundImage = `url(${ev.url})`;
                    }

                    break;
                }
                case "timer": {
                    if (ev.command === "reset") {
                        if (Game.timerTimeout) {
                            clearTimeout(Game.timerTimeout);
                        }

                        Game.timerElapsed = 0;
                        Game.timerStart = void 0;
                        Game.timerTimeout = void 0;

                        const timer = document.getElementById("timer");

                        if (timer) {
                            timer.innerHTML = "<div>0</div>:<div>0</div><div>0</div>:<div>0</div><div>0</div>.<div>0</div><div>0</div>";
                        }
                    }

                    if (ev.command === "start") {
                        if (Game.timerStart) {
                            break;
                        }

                        Game.timerStart = new Date(new Date().getTime() - Game.timerElapsed);
                        Game.timerElapsed = void 0;
                        Game.timerTimeout = setInterval(() => {
                            console.log(Game.timerElapsed, Game.timerStart);
                            Game.timerElapsed = new Date().getTime() - Game.timerStart.getTime();

                            const timer = document.getElementById("timer");

                            if (timer) {
                                timer.innerHTML = `<div>${Math.floor(Game.timerElapsed / (1000 * 60 * 60))}</div>:<div>${Math.floor(Game.timerElapsed / (1000 * 60 * 10)) % 6}</div><div>${Math.floor(Game.timerElapsed / (1000 * 60)) % 10}</div>:<div>${Math.floor(Game.timerElapsed / (1000 * 10)) % 6}</div><div>${Math.floor(Game.timerElapsed / 1000) % 10}</div>.<div>${Math.floor(Game.timerElapsed / 100) % 10}</div><div>${Math.floor(Game.timerElapsed / 10) % 10}</div>`;
                            }
                        }, 1);
                    }

                    if (ev.command === "stop") {
                        if (!Game.timerStart) {
                            break;
                        }

                        if (Game.timerTimeout) {
                            clearInterval(Game.timerTimeout);
                        }

                        Game.timerElapsed = new Date().getTime() - Game.timerStart.getTime();
                        Game.timerStart = void 0;
                        Game.timerTimeout = void 0;
                    }

                    break;
                }
                case "notification":
                    switch (ev.data.type) {
                        case "bits":
                            if (!window.Home.data.bits) {
                                window.Home.data.bits = {};
                            }

                            {
                                const bits = window.Home.data.bits;

                                if (ev.data.data.isAnonymous) {
                                    ev.data.data.user = "Anonymous";
                                    ev.data.data.name = "Anonymous";
                                    ev.data.data.totalBits = void 0;
                                }

                                if (!bits[ev.data.data.user]) {
                                    bits[ev.data.data.user] = {};
                                }

                                const user = bits[ev.data.data.user];

                                user.name = ev.data.data.name;
                                user.bits = (user.bits || 0) + ev.data.data.bits;
                                user.totalBits = ev.data.data.totalBits;
                            }

                            window.Home.data.recent.push(/* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">Bits x${ev.data.data.bits}</span>
                                </div>
                            `);

                            Game.notify("/images/roncliYouKnowIt-56.png", "/media/bits.ogg", /* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">cheered with</span>
                                    <span class="header">${format(ev.data.data.bits)}</span>
                                    <span class="text">bits${ev.data.data.totalBits ? /* html */`, for a total of</span>
                                    <span class="header">${format(ev.data.data.totalBits)}` : ""}!</span>${ev.data.data.message ? /* html */`<br />
                                    <span class="message">${window.Common.htmlEncode(ev.data.data.message)}</span>` : ""}
                                </div>
                            `);

                            break;
                        case "donation":
                            if (!window.Home.data.donation) {
                                window.Home.data.donation = {};
                            }

                            if (!window.Home.data.donation[ev.data.data.from]) {
                                window.Home.data.donation[ev.data.data.from] = {};
                            }

                            if (!window.Home.data.donation[ev.data.data.from][ev.data.data.currency]) {
                                window.Home.data.donation[ev.data.data.from][ev.data.data.currency] = 0;
                            }

                            window.Home.data.donation[ev.data.data.from][ev.data.data.currency] += ev.data.data.amount;

                            window.Home.data.recent.push(/* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.from)}</span>
                                    <span class="text">Donation</span>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.formattedAmount)}</span>
                                </div>
                            `);

                            Game.notify("/images/roncliYouKnowIt-56.png", "/media/bits.ogg", /* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.from)}</span>
                                    <span class="text">has donated</span>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.formattedAmount)}!</span>${ev.data.data.message ? /* html */`<br />
                                    <span class="message">${window.Common.htmlEncode(ev.data.data.message)}</span>` : ""}
                                </div>
                            `);

                            break;
                        case "follow":
                            if (!window.Home.data.follow) {
                                window.Home.data.follow = {};
                            }

                            window.Home.data.follow[ev.data.data.user] = ev.data.data;

                            window.Home.data.recent.push(/* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">New Follower</span>
                                </div>
                            `);

                            Game.notify("/images/roncliBoom-56.png", "/media/follow.ogg", /* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">has joined the Boom Team!</span>
                                </div>
                            `);

                            break;
                        case "giftPrime":
                            if (!window.Home.data.giftPrime) {
                                window.Home.data.giftPrime = {};
                            }

                            {
                                const giftPrime = window.Home.data.giftPrime;

                                if (!giftPrime[ev.data.data.user]) {
                                    giftPrime[ev.data.data.user] = {
                                        gifts: []
                                    };
                                }

                                const user = giftPrime[ev.data.data.user];

                                user.name = ev.data.data.name;

                                user.gifts.push(ev.data.data.gift);
                            }

                            window.Home.data.recent.push(/* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">Prime Gift</span>
                                </div>
                            `);

                            Game.notify("/images/roncliHype-56.png", "/media/prime-gift.ogg", /* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">gifted the community a</span>
                                    <span class="header">Prime Gift!</span>
                                </div>
                            `);

                            break;
                        case "raided":
                            if (!window.Home.data.raided) {
                                window.Home.data.raided = {};
                            }

                            window.Home.data.raided[ev.data.data.user] = {
                                name: ev.data.data.name,
                                viewerCount: ev.data.data.viewerCount
                            };

                            window.Home.data.recent.push(/* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">Raided${ev.data.data.viewerCount ? ` x${ev.data.data.viewerCount}` : ""}</span>
                                </div>
                            `);

                            Game.notify("/images/roncliYouKnowIt-56.png", "/media/host-raid.ogg", /* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">is raiding the channel${ev.data.data.viewerCount ? /* html */` with</span>
                                    <span class="header">${format(ev.data.data.viewerCount)}</span>
                                    <span class="text">${ev.data.data.viewerCount === 1 ? "raider" : "raiders"}` : ""}!</span>
                                </div>
                            `);

                            break;
                        case "redemption":
                            switch (ev.data.data.reward) {
                                case "Explosive Noise, Female Dogs":
                                    Game.notify("/images/roncliBoom-56.png", "/media/explosive-noise-female-dogs.ogg", /* html */`
                                        <div>
                                            <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                            <span class="text">has spent</span>
                                            <span class="header">${Game.cost(ev.data.data.cost)}.</span>
                                            <span class="header">Explosive noise, female dogs!</span>${ev.data.data.message ? /* html */`<br />
                                            <span class="message">${window.Common.htmlEncode(ev.data.data.message)}</span>` : ""}
                                        </div>
                                    `);

                                    break;
                                case "Noita: Eh, Steve":
                                    Game.notify("/images/roncliWhatever-56.png", "/media/eh-steve.ogg", /* html */`
                                        <div>
                                            <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                            <span class="text">has spent</span>
                                            <span class="header">${Game.cost(ev.data.data.cost)}</span>
                                            <span class="text">to say hi to</span>
                                            <span class="header">Steve.</span>${ev.data.data.message ? /* html */`<br />
                                            <span class="message">${window.Common.htmlEncode(ev.data.data.message)}</span>` : ""}
                                        </div>
                                    `);

                                    break;
                                case "Optimal Health":
                                    Game.notify("/images/roncliFine-56.png", "/media/1hp.ogg", /* html */`
                                        <div>
                                            <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                            <span class="text">has spent</span>
                                            <span class="header">${Game.cost(ev.data.data.cost)}</span>
                                            <span class="text">to remind you it's not</span>
                                            <span class="header">low health,</span>
                                            <span class="text">it's</span>
                                            <span class="header">optimal health.</span>${ev.data.data.message ? /* html */`<br />
                                            <span class="message">${window.Common.htmlEncode(ev.data.data.message)}</span>` : ""}
                                        </div>
                                    `);

                                    break;
                                case "Overload: Doing Lines":
                                    Game.notify("/images/creeper-56.png", "/media/lines.ogg", /* html */`
                                        <div>
                                            <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                            <span class="text">has spent</span>
                                            <span class="header">${Game.cost(ev.data.data.cost)}</span>
                                            <span class="text">and is</span>
                                            <span class="header">doing lines</span>
                                            <span class="text">of Mr. Bond brand</span>
                                            <span class="header">creepy bois.</span>${ev.data.data.message ? /* html */`<br />
                                            <span class="message">${window.Common.htmlEncode(ev.data.data.message)}</span>` : ""}
                                        </div>
                                    `);

                                    break;
                                case "This is fine":
                                    Game.notify("/images/roncliFine-56.png", void 0, /* html */`
                                        <div>
                                            <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                            <span class="text">has spent</span>
                                            <span class="header">${Game.cost(ev.data.data.cost)}</span>
                                            <span class="text">to</span>
                                            <span class="header">turn up the heat.</span>${ev.data.data.message ? /* html */`<br />
                                            <span class="message">${window.Common.htmlEncode(ev.data.data.message)}</span>` : ""}
                                        </div>
                                    `);

                                    window.Home.ws.send(JSON.stringify({
                                        type: "action",
                                        data: {
                                            overlay: "fire",
                                            soundPath: "/media/fire.ogg"
                                        }
                                    }));

                                    break;
                                case "Achievement Unlocked":
                                    Game.notify("/images/roncli-10-56.png", "/media/achievement.ogg", /* html */`
                                        <div class="achievement">
                                            <span class="text">Achievement Unlocked!</span>${ev.data.data.message ? /* html */`
                                            <span class="header">${window.Common.htmlEncode(ev.data.data.message)}</span>` : ""}
                                        </div>
                                    `);

                                    window.Home.data.achievementPoints = (window.Home.data.achievementPoints || 0) + 10;

                                    window.Home.data.achievements.push({
                                        from: ev.data.data.name,
                                        message: ev.data.data.message
                                    });

                                    break;
                                case "VIP Badge":
                                    Game.notify("/images/roncliHype-56.png", "/media/redemption.ogg", /* html */`
                                        <div>
                                            <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                            <span class="text">has spent</span>
                                            <span class="header">${Game.cost(ev.data.data.cost)}</span>
                                            <span class="text">to become a</span>
                                            <span class="header">Channel VIP!</span>${ev.data.data.message ? /* html */`<br />
                                            <span class="message">${window.Common.htmlEncode(ev.data.data.message)}</span>` : ""}
                                        </div>
                                    `);

                                    break;
                                case "You know it":
                                    Game.notify("/images/roncliYouKnowIt-56.png", "/media/you-know-it.ogg", /* html */`
                                        <div>
                                            <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                            <span class="text">has spent</span>
                                            <span class="header">${Game.cost(ev.data.data.cost)}.</span>
                                            <span class="header">You know it!</span>${ev.data.data.message ? /* html */`<br />
                                            <span class="message">${window.Common.htmlEncode(ev.data.data.message)}</span>` : ""}
                                        </div>
                                    `);

                                    break;
                                default:
                                    Game.notify("/images/roncliHype-56.png", "/media/redemption.ogg", /* html */`
                                        <div>
                                            <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                            <span class="text">has spent</span>
                                            <span class="header">${Game.cost(ev.data.data.cost)}</span>
                                            <span class="text">for</span>
                                            <span class="header">${ev.data.data.reward}!</span>${ev.data.data.message ? /* html */`<br />
                                            <span class="message">${window.Common.htmlEncode(ev.data.data.message)}</span>` : ""}
                                        </div>
                                    `);

                                    break;
                            }
                            break;
                        case "resub":
                            if (!window.Home.data.sub) {
                                window.Home.data.sub = {};
                            }

                            window.Home.data.sub[ev.data.data.user] = {
                                name: ev.data.data.name,
                                isPrime: ev.data.data.isPrime,
                                months: ev.data.data.months,
                                streak: ev.data.data.streak,
                                tier: ev.data.data.tier
                            };

                            window.Home.data.recent.push(/* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">Resub${ev.data.data.months ? ` x${ev.data.data.months}` : ""}</span>
                                </div>
                            `);

                            Game.notify("/images/roncliGetRekt-56.png", "/media/sub.ogg", /* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">has ${ev.data.data.months && ev.data.data.months > 1 ? "been" : "become"} a</span>
                                    <span class="header">${Game.getTierName(ev.data.data.tier, ev.data.data.isPrime)}${ev.data.data.streak && ev.data.data.streak > 1 ? /* html */`</span>
                                    <span class="text">for</span>
                                    <span class="header">${ev.data.data.streak}</span>
                                    <span class="text">months in a row${ev.data.data.months && ev.data.data.months > 1 && ev.data.data.months > ev.data.data.streak ? /* html */`, for a total of</span>
                                    <span class="header">${ev.data.data.months}</span>
                                    <span class="text">months` : ""}` : ev.data.data.months && ev.data.data.months > 1 ? /* html */`</span>
                                    <span class="text">for</span>
                                    <span class="header">${ev.data.data.months}</span>
                                    <span class="text">months` : ""}!</span>${ev.data.data.message ? /* html */`<br />
                                    <span class="message">${window.Common.htmlEncode(ev.data.data.message)}</span>` : ""}
                                </div>
                            `);

                            break;
                        case "sub":
                            if (!window.Home.data.sub) {
                                window.Home.data.sub = {};
                            }

                            window.Home.data.sub[ev.data.data.user] = {
                                name: ev.data.data.name,
                                isPrime: ev.data.data.isPrime,
                                months: ev.data.data.months,
                                streak: ev.data.data.streak,
                                tier: ev.data.data.tier
                            };

                            window.Home.data.recent.push(/* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">Sub${ev.data.data.months ? ` x${ev.data.data.months}` : ""}</span>
                                </div>
                            `);

                            Game.notify("/images/roncliGetRekt-56.png", "/media/sub.ogg", /* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">has ${ev.data.data.months && ev.data.data.months > 1 ? "been" : "become"} a</span>
                                    <span class="header">${Game.getTierName(ev.data.data.tier, ev.data.data.isPrime)}${ev.data.data.streak && ev.data.data.streak > 1 ? /* html */`</span>
                                    <span class="text">for</span>
                                    <span class="header">${ev.data.data.streak}</span>
                                    <span class="text">months in a row${ev.data.data.months && ev.data.data.months > 1 && ev.data.data.months > ev.data.data.streak ? /* html */`, for a total of</span>
                                    <span class="header">${ev.data.data.months}</span>
                                    <span class="text">months` : ""}` : ev.data.data.months && ev.data.data.months > 1 ? /* html */`</span>
                                    <span class="text">for</span>
                                    <span class="header">${ev.data.data.months}</span>
                                    <span class="text">months` : ""}!</span>${ev.data.data.message ? /* html */`<br />
                                    <span class="message">${window.Common.htmlEncode(ev.data.data.message)}</span>` : ""}
                                </div>
                            `);

                            break;
                        case "subExtend":
                            if (!window.Home.data.sub) {
                                window.Home.data.sub = {};
                            }

                            window.Home.data.sub[ev.data.data.user] = {
                                name: ev.data.data.name,
                                isPrime: false,
                                months: ev.data.data.months,
                                streak: void 0,
                                tier: ev.data.data.tier
                            };

                            window.Home.data.recent.push(/* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">Sub${ev.data.data.months ? ` x${ev.data.data.months}` : ""}</span>
                                </div>
                            `);

                            Game.notify("/images/roncliGetRekt-56.png", "/media/sub.ogg", /* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">has ${ev.data.data.months && ev.data.data.months > 1 ? "been" : "become"} a</span>
                                    <span class="header">${Game.getTierName(ev.data.data.tier, ev.data.data.isPrime)}${ev.data.data.months && ev.data.data.months > 1 ? /* html */`</span>
                                    <span class="text">for</span>
                                    <span class="header">${ev.data.data.months}</span>
                                    <span class="text">months` : ""}!</span>
                                </div>
                            `);

                            break;
                        case "subGift":
                            if (!window.Home.data.subGift) {
                                window.Home.data.subGift = {};
                            }

                            {
                                const subGift = window.Home.data.subGift;

                                if (!subGift[ev.data.data.gifterUser]) {
                                    subGift[ev.data.data.gifterUser] = {
                                        gifts: [],
                                        total: void 0
                                    };
                                }

                                const user = subGift[ev.data.data.gifterUser];

                                user.name = ev.data.data.gifterName;
                                user.total = ev.data.data.totalGiftCount || user.total;

                                user.gifts.push({
                                    name: ev.data.data.gifterName,
                                    recipient: ev.data.data.name,
                                    isPrime: ev.data.data.isPrime,
                                    months: ev.data.data.months,
                                    streak: ev.data.data.streak,
                                    tier: ev.data.data.tier
                                });
                            }

                            Game.notify("/images/roncliHype-56.png", "/media/sub-gift.ogg", /* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.gifterName)}</span>
                                    <span class="text">has made</span>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">a</span>
                                    <span class="header">${Game.getTierName(ev.data.data.tier, ev.data.data.isPrime)}!</span>${ev.data.data.message ? /* html */`<br />
                                    <span class="message">${window.Common.htmlEncode(ev.data.data.message)}</span>` : ""}
                                </div>
                            `);

                            break;
                        case "subGiftCommunity":
                            if (!window.Home.data.subGift) {
                                window.Home.data.subGift = {};
                            }

                            {
                                const subGift = window.Home.data.subGift;

                                if (!subGift[ev.data.data.user]) {
                                    subGift[ev.data.data.user] = {
                                        name: ev.data.data.name,
                                        gifts: [],
                                        total: void 0
                                    };
                                }

                                const user = subGift[ev.data.data.user];

                                user.total = ev.data.data.totalGiftCount || user.total;
                            }

                            window.Home.data.recent.push(/* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">Gifted Subs${ev.data.data.giftCount ? ` x${ev.data.data.giftCount}` : ""}</span>
                                </div>
                            `);

                            Game.notify("/images/roncliHype-56.png", "/media/sub-gift.ogg", /* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">has created</span>
                                    <span class="header">${ev.data.data.giftCount} ${Game.getTierName(ev.data.data.tier, ev.data.data.isPrime)}${ev.data.data.giftCount === 1 ? "" : "s"}${ev.data.data.totalGiftCount ? /* html */`</span>
                                    <span class="text">for a total of</span>
                                    <span class="header">${format(ev.data.data.totalGiftCount)}` : ""}!</span>
                                </div>
                            `);

                            break;
                        case "subGiftCommunityPayForward":
                            window.Home.data.recent.push(/* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">Paid Forward Gift Sub from</span>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.originalGifter)}</span>
                                </div>
                            `);

                            Game.notify("/images/roncliHype-56.png", "/media/sub-gift.ogg", /* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">is seeking out another</span>
                                    <span class="header">Demolitionist</span>
                                    <span class="text">for</span>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.originalGifter || "Anonymous")}!</span>
                                </div>
                            `);

                            break;
                        case "subGiftPayForward":
                            window.Home.data.recent.push(/* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">Paid Forward Gifted Sub from</span>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.originalGifter)}</span>
                                    <span class="text">to</span>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.recipient)}</span>
                                </div>
                            `);

                            Game.notify("/images/roncliHype-56.png", "/media/sub-gift.ogg", /* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">has made</span>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.recipient)}</span>
                                    <span class="text">a</span>
                                    <span class="header">Demolitionist</span>
                                    <span class="text">for</span>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.originalGifter)}!</span>
                                </div>
                            `);

                            break;
                        case "subGiftUpgrade":
                            if (!window.Home.data.sub) {
                                window.Home.data.sub = {};
                            }

                            window.Home.data.sub[ev.data.data.user] = {
                                name: ev.data.data.name,
                                isPrime: false,
                                months: void 0,
                                streak: void 0,
                                tier: "Upgraded"
                            };

                            window.Home.data.recent.push(/* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">Continued Gift Sub from</span>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.gifter)}</span>
                                </div>
                            `);

                            Game.notify("/images/roncliGetRekt-56.png", "/media/sub.ogg", /* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">has chosen to upgrade their gift sub from</span>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.gifter)}!</span>
                                </div>
                            `);

                            break;
                        case "subPrimeUpgraded":
                            if (!window.Home.data.sub) {
                                window.Home.data.sub = {};
                            }

                            window.Home.data.sub[ev.data.data.user] = {
                                name: ev.data.data.name,
                                isPrime: false,
                                months: void 0,
                                streak: void 0,
                                tier: ev.data.data.tier
                            };

                            window.Home.data.recent.push(/* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">Upgraded from Prime Sub</span>
                                </div>
                            `);

                            Game.notify("/images/roncliGetRekt-56.png", "/media/sub.ogg", /* html */`
                                <div>
                                    <span class="header">${window.Common.htmlEncode(ev.data.data.name)}</span>
                                    <span class="text">is now a full</span>
                                    <span class="header">${Game.getTierName(ev.data.data.tier)}!</span>
                                </div>
                            `);

                            break;
                    }
                    break;
            }
        };

        window.Home.startSpotify();
    }
}

Game.lastTrack = "";

/** @type {NodeJS.Timeout} */
Game.notifyTimeout = void 0;

/** @type {number} */
Game.timerElapsed = 0;

/** @type {Date} */
Game.timerStart = void 0;

/** @type {NodeJS.Timeout} */
Game.timerTimeout = void 0;

window.Game = Game;
