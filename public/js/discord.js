//  ####     #                                    #
//   #  #                                         #
//   #  #   ##     ###    ###    ###   # ##    ## #
//   #  #    #    #      #   #  #   #  ##  #  #  ##
//   #  #    #     ###   #      #   #  #      #   #
//   #  #    #        #  #   #  #   #  #      #  ##
//  ####    ###   ####    ###    ###   #       ## #
/**
 * A class that handles redirecting to Discord's voice overlay.
 */
class Discord {
    // ###    ##   #  #   ##                #                 #    #                    #           #
    // #  #  #  #  ####  #  #               #                 #    #                    #           #
    // #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
    // #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
    // #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
    // ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
    /**
     * Starts up the Discord page.
     * @returns {void}
     */
    static DOMContentLoaded() {
        Discord.ws = new WebSocket(`ws://${document.location.hostname}:${document.location.port || "80"}/ws/listen`);

        Discord.ws.onmessage = (ev) => {
            const data = JSON.parse(ev.data);

            switch (data.type) {
                case "channel":
                    window.location = `https://streamkit.discordapp.com/overlay/voice/${data.channel}`;
                    break;
            }
        };
    }
}

document.addEventListener("DOMContentLoaded", Discord.DOMContentLoaded);
