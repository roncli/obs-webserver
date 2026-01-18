// MARK: class Discord
/**
 * A class that handles redirecting to Discord's voice overlay.
 */
class Discord {
    // MARK: static DOMContentLoaded
    /**
     * Starts up the Discord page.
     * @returns {void}
     */
    static DOMContentLoaded() {
        Discord.ws = new WebSocket("ws://" + document.location.hostname + ":" + (document.location.port || "80") + "/");

        Discord.ws.onmessage = (ev) => {
            const data = JSON.parse(ev.data);

            switch (data.type) {
                case "discord":
                    window.location = `https://streamkit.discord.com/overlay/voice/${data.data.guildId}/${data.data.channelId}`;
                    break;
            }
        };
    }
}

window.Discord = Discord;

document.addEventListener("DOMContentLoaded", Discord.DOMContentLoaded);
