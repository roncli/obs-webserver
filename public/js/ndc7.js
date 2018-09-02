const delay = 20000,
    tiers = [
        "Blood",
        "Titanium",
        "Obsidian",
        "Crystal"
    ];

/**
 * Starts the carousel.
 * @param {object} results The data provided by the API.
 * @returns {void}
 */
const start = (results) => {
    let tier = 0,
        status = 0,
        index = 0;

    const data = results.races,
        standings = results.standings,
        $standings = document.querySelector(".standings"),
        $results = document.querySelector(".results"),
        $upcoming = document.querySelector(".upcoming"),

        nextStandings = function() {
            const $tbody = document.querySelector(".standings tbody");

            let standing;

            $standings.classList.remove("hidden");
            $results.classList.add("hidden");
            $upcoming.classList.add("hidden");

            while ($tbody.firstChild) {
                $tbody.removeChild($tbody.firstChild);
            }

            for (let ix = index; ix < index + 20 && ix < standings.length; ix++) {
                standing = standings[ix];

                const row = document.createElement("tr");
                let node;

                node = document.createElement("td");
                node.innerText = ix + 1;
                row.appendChild(node);

                node = document.createElement("td");
                node.innerText = standing.player;
                row.appendChild(node);

                node = document.createElement("td");
                node.innerText = standing.points;
                row.appendChild(node);

                node = document.createElement("td");
                node.innerText = standing.week1;
                row.appendChild(node);

                node = document.createElement("td");
                node.innerText = standing.week2;
                row.appendChild(node);

                node = document.createElement("td");
                node.innerText = standing.week3;
                row.appendChild(node);

                node = document.createElement("td");
                node.innerText = standing.week4;
                row.appendChild(node);

                node = document.createElement("td");
                node.innerText = standing.week5;
                row.appendChild(node);

                $tbody.appendChild(row);
            }

            if (standings.length > index + 20) {
                index += 20;
            } else {
                tier = 0;
                index = 0;
                status = 1;
            }

            setTimeout(next, delay);
        },

        nextResults = function() {
            if (data[tiers[tier]].previousResults.length > 0) {
                const $tbody = document.querySelector(".results tbody");

                let ix, result;

                $standings.classList.add("hidden");
                $results.classList.remove("hidden");
                $upcoming.classList.add("hidden");

                document.querySelector(".tier").innerText = tiers[tier];

                while ($tbody.firstChild) {
                    $tbody.removeChild($tbody.firstChild);
                }

                for (ix = index; ix < index + 20 && ix < data[tiers[tier]].previousResults.length; ix++) {
                    result = data[tiers[tier]].previousResults[ix];

                    const row = document.createElement("tr");
                    let node;

                    node = document.createElement("td");
                    node.innerText = result.player1 || "";
                    row.appendChild(node);

                    node = document.createElement("td");
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

            if (data[tiers[tier]].previousResults.length > index + 20) {
                index += 20;
            } else if (tier < 3) {
                tier++;
                index = 0;
            } else {
                tier = 0;
                index = 0;
                status = 2;
            }

            if (data[tiers[tier]].previousResults.length > 0) {
                setTimeout(next, delay);
            } else {
                next();
            }
        },

        nextUpcoming = function() {
            if (data[tiers[tier]].upcomingMatches.length > 0) {
                const $tbody = document.querySelector(".upcoming tbody");
                let ix, match;

                $standings.classList.add("hidden");
                $results.classList.add("hidden");
                $upcoming.classList.remove("hidden");

                document.querySelector(".tier2").innerText = tiers[tier];

                while ($tbody.firstChild) {
                    $tbody.removeChild($tbody.firstChild);
                }

                for (ix = index; ix < index + 20 && ix < data[tiers[tier]].upcomingMatches.length; ix++) {
                    match = data[tiers[tier]].upcomingMatches[ix];

                    const row = document.createElement("tr");
                    let node;

                    node = document.createElement("td");
                    node.innerText = match.player1 || "";
                    row.appendChild(node);

                    node = document.createElement("td");
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

            if (data[tiers[tier]].upcomingMatches.length > index + 20) {
                index += 20;
            } else if (tier < 3) {
                tier++;
                index = 0;
            } else {
                tier = 0;
                index = 0;
                status = 0;
            }

            if (data[tiers[tier]].upcomingMatches.length > 0) {
                setTimeout(next, delay);
            } else {
                next();
            }
        },

        next = function() {
            switch (status) {
                case 0:
                    nextStandings();
                    break;
                case 1:
                    nextResults();
                    break;
                case 2:
                    nextUpcoming();
                    break;
            }
        };

    next();
};

document.addEventListener("DOMContentLoaded", () => {
    const x = new XMLHttpRequest();
    x.onreadystatechange = function() {
        if (x.readyState === 4 && x.status === 200) {
            start(JSON.parse(x.responseText));
        }
    };
    x.open("GET", "api/necrodancerCondor7", true);
    x.send();
});
