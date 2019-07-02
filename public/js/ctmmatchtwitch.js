//   ###   #####  #   #  #   #          #            #      #####           #     #            #
//  #   #    #    #   #  #   #          #            #        #                   #            #
//  #        #    ## ##  ## ##   ###   ####    ###   # ##     #    #   #   ##    ####    ###   # ##
//  #        #    # # #  # # #      #   #     #   #  ##  #    #    #   #    #     #     #   #  ##  #
//  #        #    #   #  #   #   ####   #     #      #   #    #    # # #    #     #     #      #   #
//  #   #    #    #   #  #   #  #   #   #  #  #   #  #   #    #    # # #    #     #  #  #   #  #   #
//   ###     #    #   #  #   #   ####    ##    ###   #   #    #     # #    ###     ##    ###   #   #
/**
 * A class of static functions for the Classic Tetris Monthly match Twitch page.
 */
class NDRaceTwitch {
    // ###    ##   #  #   ##                #                 #    #                    #           #
    // #  #  #  #  ####  #  #               #                 #    #                    #           #
    // #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
    // #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
    // #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
    // ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
    /**
     * Starts up the race page.
     * @returns {void}
     */
    static DOMContentLoaded() {
        const params = new URLSearchParams(window.location.search);

        new Twitch.Player("player1", {
            width: 960,
            height: 540,
            channel: params.get("player1")
        });
        new Twitch.Player("player2", {
            width: 960,
            height: 540,
            channel: params.get("player2")
        });
    }
}

document.addEventListener("DOMContentLoaded", NDRaceTwitch.DOMContentLoaded);
