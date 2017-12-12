document.addEventListener("DOMContentLoaded", function(ev) {
    document.querySelector(".small").classList.add("animate");
    document.querySelector(".large").classList.add("animate");
    document.querySelector("#countdownHype").play();

    setTimeout(function() {
        var goal = new Date().getTime() + 7200000,
            timer = setInterval(function() {
                var now = new Date(),
                    diff = goal - now.getTime(),
                    h, m, s, ms;

                if (diff < 0) {
                    diff = 0;
                    document.querySelector("#buzzer").play();
                    clearTimeout(timer);
                }
                h = (Math.floor(diff / 3600000) / 10).toFixed(1).substring(2),
                m = (Math.floor(diff % 3600000 / 60000) / 100).toFixed(2).substring(2),
                s = (Math.floor(diff % 60000 / 1000) / 100).toFixed(2).substring(2),
                ms = (diff % 1000 / 1000).toFixed(3).substring(2, 4);

                document.querySelector(".timer").innerText = "WEEK THE WORLD: " + h + ":" + m + ":" + s + "." + ms;
            }, 1);
    }, 10000);
});
