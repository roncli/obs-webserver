document.addEventListener("DOMContentLoaded", function(ev) {
    var fx = function() {
        var x = new XMLHttpRequest();

        x.onreadystatechange = function() {
            var stats, index, match, node;

            if (x.readyState == 4 && x.status == 200) {
                stats = JSON.parse(x.responseText);

                if (stats) {
                    document.querySelector(".rank").innerText = stats.rating + " #" + stats.rank.toString();
                    document.querySelector(".diamond").innerText = stats.records.diamond.wins.toString() + "-" + stats.records.diamond.losses.toString();
                    document.querySelector(".gold").innerText = stats.records.gold.wins.toString() + "-" + stats.records.gold.losses.toString();
                    document.querySelector(".silver").innerText = stats.records.silver.wins.toString() + "-" + stats.records.silver.losses.toString();
                    document.querySelector(".bronze").innerText = stats.records.bronze.wins.toString() + "-" + stats.records.bronze.losses.toString();
                    document.querySelector(".unrated").innerText = stats.records.unrated.wins.toString() + "-" + stats.records.unrated.losses.toString();
                    $games = document.querySelector(".games");

                    while ($games.firstChild) {
                        $games.removeChild($games.firstChild);
                    }

                    for (index = 0; index < 5 && index < stats.matches.length; index++) {
                        match = stats.matches[index]
                        node = document.createElement("div");
                        node.innerText = (match.pilot.score > match.opponent.score ? "W " : "L ") + match.pilot.score.toString() + "-" + match.opponent.score.toString() + " vs. " + match.opponent.name + " " + match.game + " " + match.map;
                        $games.appendChild(node);
                    }
                    document.querySelector(".dcl").classList.remove("hidden");
                } else {
                    document.querySelector(".dcl").classList.add("hidden");
                }

                setTimeout(fx, 300000);
            }
        };

        x.open("GET", "api/dclstats", true);
        x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        x.send();
    };

    fx();
});
