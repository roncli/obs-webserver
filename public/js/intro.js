document.addEventListener("DOMContentLoaded", function(ev) {
    return;
    
    var time = (new Date()).getTime() + 300000,
        played = false,
        fading = false,
        countdown = false,

        fx = function() {
            var remaining = new Date(time - (new Date()).getTime()),
                remainingTime = remaining.getTime(),
                statusText = document.querySelector(".statusText"),

                playSong = function(track, playlist) {
                    var x = new XMLHttpRequest();
                    x.open("POST", "api/playSong", true);
                    x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    if (track) {
                        x.send("track=" + track + "&stop=true");
                    } else if (playlist) {
                        x.send("playlist=" + playlist + "&stop=true");
                    }
                }

            if (remainingTime > 0) {
                statusText.innerText = remaining.toLocaleDateString("en-us", {timeZone: "UTC", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit"}).split(" ")[1];
                setTimeout(fx, remainingTime % 1000 + 250);

                if (remainingTime < 256000 && !played) {
                    played = true;
                    playSong("spotify:track:6teNGJXM3cwa3saa4rOQjJ");
                }

                if (remainingTime < 15000 && !fading) {
                    fading = true;

                    document.querySelector(".intro").classList.add("fadeout");
                }

                if (remainingTime < 11000 && !countdown) {
                    countdown = true;

                    document.querySelector(".small").classList.add("animate");
                    document.querySelector(".large").classList.add("animate");
                    document.querySelector("#countdownHype").play();

                    setTimeout(function() {
                        var fxs = [
                            function() {
                                var song = document.querySelector("#roncliProductionsOrchestral");
                                song.volume = 0.5;
                                song.play();
                                fx2 = function() {
                                    playSong(void 0, "spotify:user:1211227601:playlist:1nMLyrctc5JXOku6VAioQy");
                                };
                            },
                            function() {
                                var song = document.querySelector("#roncliProductionsTechno");
                                song.volume = 0.5;
                                song.play();
                                fx2 = function() {
                                    playSong(void 0, "spotify:user:1211227601:playlist:6G7GIgZPWqdubVd7EdKiQy");
                                };
                            },
                            function() {
                                var song = document.querySelector("#roncliProductionsPiano");
                                song.volume = 0.5;
                                song.play();
                                fx2 = function() {
                                    playSong(void 0, "spotify:user:1211227601:playlist:3hQlX9BdcT180SCR3auLtz");
                                };
                            }
                        ],
                            fx2;
                        document.querySelector(".outro").classList.add("animate");
                        
                        fxs.sort(function(a, b) {
                            if (!a.seed) {
                                a.seed = Math.random();
                            }
                            if (!b.seed) {
                                b.seed = Math.random();
                            }
                            return a.seed - b.seed;
                        });

                        fxs[0]();
                        setTimeout(fx2, 13000);
                    }, 12000);
                }
            }
        };

    fx();
});
