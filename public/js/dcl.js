document.addEventListener("DOMContentLoaded", () => {
    const fx = () => {
        const x = new XMLHttpRequest();

        x.onreadystatechange = function() {
            if (x.readyState === 4 && x.status === 200) {
                const stats = JSON.parse(x.responseText);

                if (stats) {
                    const games = document.querySelector(".games");

                    document.querySelector("#dcl .rank").innerText = `${stats.rating} #${stats.rank}`;
                    document.querySelector("#dcl .diamond").innerText = `${stats.records.diamond.wins}-${stats.records.diamond.losses}`;
                    document.querySelector("#dcl .gold").innerText = `${stats.records.gold.wins}-${stats.records.gold.losses}`;
                    document.querySelector("#dcl .silver").innerText = `${stats.records.silver.wins}-${stats.records.silver.losses}`;
                    document.querySelector("#dcl .bronze").innerText = `${stats.records.bronze.wins}-${stats.records.bronze.losses}`;
                    document.querySelector("#dcl .unrated").innerText = `${stats.records.unrated.wins}-${stats.records.unrated.losses}`;

                    while (games.firstChild) {
                        games.removeChild(games.firstChild);
                    }

                    for (let index = 0; index < 5 && index < stats.matches.length; index++) {
                        const {matches: {[index]: match}} = stats,
                            div = document.createElement("div");

                        div.innerText = `${match.pilot.score > match.opponent.score ? "W" : "L"} ${match.pilot.score}-${match.opponent.score} vs. ${match.opponent.name}, ${match.game} ${match.map}`;
                        games.appendChild(div);
                    }
                    document.getElementById("dcl").classList.remove("hidden");
                } else {
                    document.getElementById("dcl").classList.add("hidden");
                }

                setTimeout(fx, 300000);
            }
        };

        x.open("GET", "api/dclStats", true);
        x.send();
    };

    fx();
});
