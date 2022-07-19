const DiscordJs = require("discord.js"),

    Log = require("../logging/log"),
    settings = require("../../settings"),

    discord = new DiscordJs.Client(settings.discord.options);

let readied = false;

/** @type {DiscordJs.Guild} */
let guild;

//  ####     #                                    #
//   #  #                                         #
//   #  #   ##     ###    ###    ###   # ##    ## #
//   #  #    #    #      #   #  #   #  ##  #  #  ##
//   #  #    #     ###   #      #   #  #      #   #
//   #  #    #        #  #   #  #   #  #      #  ##
//  ####    ###   ####    ###    ###   #       ## #
/**
 * A static class that handles all Discord.js interctions.
 */
class Discord {
    //       #                             ##
    //       #                              #
    //  ##   ###    ###  ###   ###    ##    #     ###
    // #     #  #  #  #  #  #  #  #  # ##   #    ##
    // #     #  #  # ##  #  #  #  #  ##     #      ##
    //  ##   #  #   # #  #  #  #  #   ##   ###   ###
    /**
     * Returns the channels on the server.
     * @returns {DiscordJs.Collection<string, DiscordJs.GuildChannel | DiscordJs.ThreadChannel>} The channels.
     */
    static get channels() {
        if (guild) {
            return guild.channels.cache;
        }

        return new DiscordJs.Collection();
    }

    //  #
    //
    // ##     ##    ##   ###
    //  #    #     #  #  #  #
    //  #    #     #  #  #  #
    // ###    ##    ##   #  #
    /**
     * Returns the guild's icon.
     * @returns {string} The URL of the icon.
     */
    static get icon() {
        if (discord && discord.ws && discord.ws.status === 0) {
            return discord.user.avatarURL();
        }

        return void 0;
    }

    //  #       #
    //          #
    // ##     ###
    //  #    #  #
    //  #    #  #
    // ###    ###
    /**
     * Returns the server ID.
     * @returns {string} The ID of the server.
     */
    static get id() {
        if (guild) {
            return guild.id;
        }

        return void 0;
    }

    //         #                 #
    //         #                 #
    //  ###   ###    ###  ###   ###   #  #  ###
    // ##      #    #  #  #  #   #    #  #  #  #
    //   ##    #    # ##  #      #    #  #  #  #
    // ###      ##   # #  #       ##   ###  ###
    //                                      #
    /**
     * Sets up Discord events.  Should only ever be called once.
     * @returns {void}
     */
    static startup() {
        discord.on("ready", () => {
            guild = discord.guilds.cache.find((g) => g.name === settings.guild);

            if (!readied) {
                readied = true;
            }
        });

        discord.on("disconnect", (ev) => {
            Log.exception("Disconnected from Discord.", ev);
        });

        discord.on("error", (err) => {
            if (err.message === "read ECONNRESET") {
                // Swallow this error, see https://github.com/discordjs/discord.js/issues/3043#issuecomment-465543902
                return;
            }

            Log.exception("Discord error.", err);
        });
    }

    //                                      #
    //                                      #
    //  ##    ##   ###   ###    ##    ##   ###
    // #     #  #  #  #  #  #  # ##  #      #
    // #     #  #  #  #  #  #  ##    #      #
    //  ##    ##   #  #  #  #   ##    ##     ##
    /**
     * Connects to Discord.
     * @returns {Promise} A promise that resolves once Discord is connected.
     */
    static async connect() {
        Log.log("Connecting to Discord...");

        try {
            await discord.login(settings.discord.token);
            Log.log("Connected to Discord.");
        } catch (err) {
            Log.exception("Error connecting to Discord, will automatically retry.", err);
        }
    }

    //  #            ##                                  #             #
    //              #  #                                 #             #
    // ##     ###   #      ##   ###   ###    ##    ##   ###    ##    ###
    //  #    ##     #     #  #  #  #  #  #  # ##  #      #    # ##  #  #
    //  #      ##   #  #  #  #  #  #  #  #  ##    #      #    ##    #  #
    // ###   ###     ##    ##   #  #  #  #   ##    ##     ##   ##    ###
    /**
     * Determines whether the bot is connected to Discord.
     * @returns {boolean} Whether the bot is connected to Discord.
     */
    static isConnected() {
        return discord && discord.ws && guild ? discord.ws.status === 0 : false;
    }

    //  ###  #  #   ##   #  #   ##
    // #  #  #  #  # ##  #  #  # ##
    // #  #  #  #  ##    #  #  ##
    //  ###   ###   ##    ###   ##
    //    #
    /**
     * Queues a message to be sent.
     * @param {string} message The message to be sent.
     * @param {DiscordJs.TextChannel|DiscordJs.DMChannel|DiscordJs.GuildMember} channel The channel to send the message to.
     * @returns {Promise<DiscordJs.Message>} A promise that resolves with the sent message.
     */
    static async queue(message, channel) {
        if (channel.id === discord.user.id) {
            return void 0;
        }

        let msg;
        try {
            msg = await Discord.richQueue(new DiscordJs.EmbedBuilder({description: message}), channel);
        } catch {}
        return msg;
    }

    //             #              #  ###          #    ##       #
    //             #              #  #  #               #       #
    //  ##   # #   ###    ##    ###  ###   #  #  ##     #     ###   ##   ###
    // # ##  ####  #  #  # ##  #  #  #  #  #  #   #     #    #  #  # ##  #  #
    // ##    #  #  #  #  ##    #  #  #  #  #  #   #     #    #  #  ##    #
    //  ##   #  #  ###    ##    ###  ###    ###  ###   ###    ###   ##   #
    /**
     * Gets a new DiscordJs EmbedBuilder object.
     * @param {DiscordJs.EmbedData} [options] The options to pass.
     * @returns {DiscordJs.EmbedBuilder} The EmbedBuilder object.
     */
    static embedBuilder(options) {
        return new DiscordJs.EmbedBuilder(options);
    }

    //        #          #      ##
    //                   #     #  #
    // ###   ##     ##   ###   #  #  #  #   ##   #  #   ##
    // #  #   #    #     #  #  #  #  #  #  # ##  #  #  # ##
    // #      #    #     #  #  ## #  #  #  ##    #  #  ##
    // #     ###    ##   #  #   ##    ###   ##    ###   ##
    //                            #
    /**
     * Queues a rich embed message to be sent.
     * @param {DiscordJs.EmbedBuilder} embed The message to be sent.
     * @param {DiscordJs.TextChannel|DiscordJs.DMChannel|DiscordJs.GuildMember} channel The channel to send the message to.
     * @returns {Promise<DiscordJs.Message>} A promise that resolves with the sent message.
     */
    static async richQueue(embed, channel) {
        if (channel.id === discord.user.id) {
            return void 0;
        }

        embed.setFooter({text: embed.data && embed.data.footer ? embed.data.footer.text : "obs-webserver", iconURL: Discord.icon});

        if (embed && embed.data && embed.data.fields) {
            embed.data.fields.forEach((field) => {
                if (field.value && field.value.length > 1024) {
                    field.value = field.value.substring(0, 1024);
                }
            });
        }

        if (!embed.data && embed.data.color) {
            embed.setColor(0x191935);
        }

        if (!embed.data && !embed.data.timestamp) {
            embed.setTimestamp(new Date());
        }

        let msg;
        try {
            const msgSend = await channel.send({embeds: [embed]});

            if (msgSend instanceof Array) {
                msg = msgSend[0];
            } else {
                msg = msgSend;
            }
        } catch {}
        return msg;
    }

    //   #    #             #  ###                #     ##   #                             ##    ###         #  #
    //  # #                 #   #                 #    #  #  #                              #    #  #        ## #
    //  #    ##    ###    ###   #     ##   #  #  ###   #     ###    ###  ###   ###    ##    #    ###   #  #  ## #   ###  # #    ##
    // ###    #    #  #  #  #   #    # ##   ##    #    #     #  #  #  #  #  #  #  #  # ##   #    #  #  #  #  # ##  #  #  ####  # ##
    //  #     #    #  #  #  #   #    ##     ##    #    #  #  #  #  # ##  #  #  #  #  ##     #    #  #   # #  # ##  # ##  #  #  ##
    //  #    ###   #  #   ###   #     ##   #  #    ##   ##   #  #   # #  #  #  #  #   ##   ###   ###     #   #  #   # #  #  #   ##
    //                                                                                                  #
    /**
     * Finds a Discord text channel by its name.
     * @param {string} name The name of the channel.
     * @returns {DiscordJs.TextChannel} The Discord text channel.
     */
    static findTextChannelByName(name) {
        if (!guild) {
            return void 0;
        }
        return /** @type {DiscordJs.TextChannel} */(guild.channels.cache.find((c) => c.name === name && c.type === DiscordJs.ChannelType.GuildText)); // eslint-disable-line no-extra-parens
    }
}

module.exports = Discord;
