//  #   #      #         #####
//  #   #      #             #
//  ##  #   ## #   ###      #
//  # # #  #  ##  #   #     #
//  #  ##  #   #  #        #
//  #   #  #  ##  #   #   #
//  #   #   ## #   ###    #
/**
 * A class to display stats for NecroDancer CoNDOR Season 7.
 */
class Ndc7 {
    //         #                 #
    //         #                 #
    //  ###   ###    ###  ###   ###
    // ##      #    #  #  #  #   #
    //   ##    #    # ##  #      #
    // ###      ##   # #  #       ##
    /**
     * Starts the carousel.
     * @param {object} results The data provided by the API.
     * @returns {void}
     */
    static start(results) {
        Ndc7.delay = 20000;
        Ndc7.tiers = [
            "Blood",
            "Titanium",
            "Obsidian",
            "Crystal"
        ];
        Ndc7.tier = 0;
        Ndc7.status = 0;
        Ndc7.index = 0;
        Ndc7.data = results.races;
        Ndc7.standings = results.standings;

        Ndc7.next();
    }

    //                    #     ##    #                   #   #
    //                    #    #  #   #                   #
    // ###    ##   #  #  ###    #    ###    ###  ###    ###  ##    ###    ###   ###
    // #  #  # ##   ##    #      #    #    #  #  #  #  #  #   #    #  #  #  #  ##
    // #  #  ##     ##    #    #  #   #    # ##  #  #  #  #   #    #  #   ##     ##
    // #  #   ##   #  #    ##   ##     ##   # #  #  #   ###  ###   #  #  #     ###
    //                                                                    ###
    /**
     * Displays the next standings page.
     * @returns {void}
     */
    static nextStandings() {
        const $tbody = document.querySelector(".standings tbody");
        let standing;

        document.querySelector(".standings").classList.remove("hidden");
        document.querySelector(".results").classList.add("hidden");
        document.querySelector(".upcoming").classList.add("hidden");

        while ($tbody.firstChild) {
            $tbody.removeChild($tbody.firstChild);
        }

        for (let ix = Ndc7.index; ix < Ndc7.index + 20 && ix < Ndc7.standings.length; ix++) {
            standing = Ndc7.standings[ix];

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

        if (Ndc7.standings.length > Ndc7.index + 20) {
            Ndc7.index += 20;
        } else {
            Ndc7.tier = 0;
            Ndc7.index = 0;
            Ndc7.status = 1;
        }

        setTimeout(Ndc7.next, Ndc7.delay);
    }

    //                    #    ###                      ##     #
    //                    #    #  #                      #     #
    // ###    ##   #  #  ###   #  #   ##    ###   #  #   #    ###    ###
    // #  #  # ##   ##    #    ###   # ##  ##     #  #   #     #    ##
    // #  #  ##     ##    #    # #   ##      ##   #  #   #     #      ##
    // #  #   ##   #  #    ##  #  #   ##   ###     ###  ###     ##  ###
    /**
     * Displays the next results page.
     * @returns {void}
     */
    static nextResults() {
        const resultCount = Ndc7.data[Ndc7.tiers[Ndc7.tier]].previousResults.length;

        if (resultCount > 0) {
            const $tbody = document.querySelector(".results tbody");
            let ix, result;

            document.querySelector(".standings").classList.add("hidden");
            document.querySelector(".results").classList.remove("hidden");
            document.querySelector(".upcoming").classList.add("hidden");

            document.querySelector(".tier").innerText = Ndc7.tiers[Ndc7.tier];

            while ($tbody.firstChild) {
                $tbody.removeChild($tbody.firstChild);
            }

            for (ix = Ndc7.index; ix < Ndc7.index + 20 && ix < Ndc7.data[Ndc7.tiers[Ndc7.tier]].previousResults.length; ix++) {
                result = Ndc7.data[Ndc7.tiers[Ndc7.tier]].previousResults[ix];

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

        if (Ndc7.data[Ndc7.tiers[Ndc7.tier]].previousResults.length > Ndc7.index + 20) {
            Ndc7.index += 20;
        } else if (Ndc7.tier < 3) {
            Ndc7.tier++;
            Ndc7.index = 0;
        } else {
            Ndc7.tier = 0;
            Ndc7.index = 0;
            Ndc7.status = 2;
        }

        if (resultCount > 0) {
            setTimeout(Ndc7.next, Ndc7.delay);
        } else {
            Ndc7.next();
        }
    }

    //                    #    #  #                           #
    //                    #    #  #
    // ###    ##   #  #  ###   #  #  ###    ##    ##   # #   ##    ###    ###
    // #  #  # ##   ##    #    #  #  #  #  #     #  #  ####   #    #  #  #  #
    // #  #  ##     ##    #    #  #  #  #  #     #  #  #  #   #    #  #   ##
    // #  #   ##   #  #    ##   ##   ###    ##    ##   #  #  ###   #  #  #
    //                               #                                    ###
    /**
     * Displays the next upcoming matches page.
     * @returns {void}
     */
    static nextUpcoming() {
        const upcomingCount = Ndc7.data[Ndc7.tiers[Ndc7.tier]].upcomingMatches.length;

        if (upcomingCount > 0) {
            const $tbody = document.querySelector(".upcoming tbody");
            let ix, match;

            document.querySelector(".standings").classList.add("hidden");
            document.querySelector(".results").classList.add("hidden");
            document.querySelector(".upcoming").classList.remove("hidden");

            document.querySelector(".tier2").innerText = Ndc7.tiers[Ndc7.tier];

            while ($tbody.firstChild) {
                $tbody.removeChild($tbody.firstChild);
            }

            for (ix = Ndc7.index; ix < Ndc7.index + 20 && ix < Ndc7.data[Ndc7.tiers[Ndc7.tier]].upcomingMatches.length; ix++) {
                match = Ndc7.data[Ndc7.tiers[Ndc7.tier]].upcomingMatches[ix];

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

        if (Ndc7.data[Ndc7.tiers[Ndc7.tier]].upcomingMatches.length > Ndc7.index + 20) {
            Ndc7.index += 20;
        } else if (Ndc7.tier < 3) {
            Ndc7.tier++;
            Ndc7.index = 0;
        } else {
            Ndc7.tier = 0;
            Ndc7.index = 0;
            Ndc7.status = 0;
        }

        if (upcomingCount > 0) {
            setTimeout(Ndc7.next, Ndc7.delay);
        } else {
            Ndc7.next();
        }
    }

    //                    #
    //                    #
    // ###    ##   #  #  ###
    // #  #  # ##   ##    #
    // #  #  ##     ##    #
    // #  #   ##   #  #    ##
    /**
     * Displays the next page.
     * @returns {void}
     */
    static next() {
        switch (Ndc7.status) {
            case 0:
                Ndc7.nextStandings();
                break;
            case 1:
                Ndc7.nextResults();
                break;
            case 2:
                Ndc7.nextUpcoming();
                break;
        }
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
        const x = new XMLHttpRequest();
        x.onreadystatechange = function() {
            if (x.readyState === 4 && x.status === 200) {
                Ndc7.start(JSON.parse(x.responseText));
            }
        };
        x.open("GET", "api/necrodancerCondor7", true);
        x.send();
    }
}

document.addEventListener("DOMContentLoaded", Ndc7.DOMContentLoaded);
