var delay = 20000;

document.addEventListener("DOMContentLoaded", function(ev) {
    var x = new XMLHttpRequest();
    x.onreadystatechange = function() {
        if (x.readyState == 4 && x.status == 200) {
            start(JSON.parse(x.responseText));
        }
    };
    x.open("GET", "api/necrodancerworldcup", true);
    x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    x.send();
});

function start(data) {
    var status = 0,
        index = 0,

        $standings = document.querySelector(".standings"),
        $results = document.querySelector(".results"),
        $upcoming = document.querySelector(".upcoming"),

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
        },

        nextStandings = function() {
            var $tbody = document.querySelector(".standings tbody");
            $standings.classList.remove("hidden");
            $results.classList.add("hidden");
            $upcoming.classList.add("hidden");
            standings = data.standings[index];

            document.querySelector(".region").innerText = standings.region;

            while ($tbody.firstChild) {
                $tbody.removeChild($tbody.firstChild);
            }

            standings.players.forEach(function(player, ix) {
                var row = document.createElement("tr"),
                    node;
                
                node = document.createElement("td");
                node.innerText = (ix + 1).toString();
                row.appendChild(node);

                node = document.createElement("td");
                node.innerText = player.name;
                row.appendChild(node);

                node = document.createElement("td");
                node.innerText = player.score;
                row.appendChild(node);

                node = document.createElement("td");
                node.innerText = player.win3;
                row.appendChild(node);

                node = document.createElement("td");
                node.innerText = player.win2;
                row.appendChild(node);

                node = document.createElement("td");
                node.innerText = player.win1;
                row.appendChild(node);

                node = document.createElement("td");
                node.innerText = player.win0;
                row.appendChild(node);

                $tbody.appendChild(row);
            });

            index++;

            if (index >= data.standings.length) {
                index = 0;
                status = 1;
            }

            setTimeout(next, delay);
        },

        nextResults = function() {
            var $tbody = document.querySelector(".results tbody"),
                ix, result;
            
            $standings.classList.add("hidden");
            $results.classList.remove("hidden");
            $upcoming.classList.add("hidden");

            while ($tbody.firstChild) {
                $tbody.removeChild($tbody.firstChild);
            }

            for (ix = index; ix < index + 20 && ix < data.previousResults.length; ix++) {
                result = data.previousResults[ix];

                var row = document.createElement("tr"),
                    node;
                
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
                node.innerText = result.score + (result.winner ? " " + result.winner : "");
                row.appendChild(node);

                $tbody.appendChild(row);
            }

            if (data.previousResults.length > index + 20) {
                index += 20;
            } else {
                index = 0;
                status = 2;
            }

            setTimeout(next, delay);
        },

        nextUpcoming = function() {
            var $tbody = document.querySelector(".upcoming tbody"),
                ix, match;
            
            $standings.classList.add("hidden");
            $results.classList.add("hidden");
            $upcoming.classList.remove("hidden");

            while ($tbody.firstChild) {
                $tbody.removeChild($tbody.firstChild);
            }

            for (ix = index; ix < index + 20 && ix < data.upcomingMatches.length; ix++) {
                match = data.upcomingMatches[ix];

                var row = document.createElement("tr"),
                    node;
                
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

            if (data.upcomingMatches.length > index + 20) {
                index += 20;
            } else {
                index = 0;
                status = 0;
            }

            setTimeout(next, delay);
        };

    // Attempt to break ties
    data.standings.forEach(function(standings) {
        standings.players.sort(function(a, b) {
            if (a.score === b.score) {
                var match = data.previousResults.filter(function(result) {
                    return (result.player1 === a.name && result.player2 === b.name) || (result.player2 === a.name && result.player1 === b.name);
                });

                if (match.length === 0) {
                    return 0;
                }

                if (match[0].winner === a.score) {
                    return -1;
                }

                return 1;
            }

            return b.score - a.score;
        });
    });

    next();
}
