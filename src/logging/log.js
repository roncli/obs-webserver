/**
 * @typedef {import("discord.js").TextChannel} DiscordJs.TextChannel
 * @typedef {import("../../types/logTypes").LogEntry} LogTypes.LogEntry
 */

const request = require("@root/request"),
    util = require("util"),

    settings = require("../../settings");

/** @type {LogTypes.LogEntry[]} */
const queue = [];

/** @type {typeof import("../discord")} */
let Discord;

let running = false;

//  #
//  #
//  #       ###    ## #
//  #      #   #  #  #
//  #      #   #   ##
//  #      #   #  #
//  #####   ###    ###
//                #   #
//                 ###
/**
 * A class that handles logging.
 */
class Log {
    // ##
    //  #
    //  #     ##    ###
    //  #    #  #  #  #
    //  #    #  #   ##
    // ###    ##   #
    //              ###
    /**
     * Logs a message.
     * @param {string} message The message to log.
     * @returns {void}
     */
    static log(message) {
        queue.push({
            type: "log",
            date: new Date(),
            message
        });
        Log.output();
    }

    //                          #
    //
    // #  #   ###  ###   ###   ##    ###    ###
    // #  #  #  #  #  #  #  #   #    #  #  #  #
    // ####  # ##  #     #  #   #    #  #   ##
    // ####   # #  #     #  #  ###   #  #  #
    //                                      ###
    /**
     * Logs a warning.
     * @param {string} message The string to log.
     * @returns {void}
     */
    static warning(message) {
        queue.push({
            type: "warning",
            date: new Date(),
            message
        });
        Log.output();
    }

    //                                #     #
    //                                #
    //  ##   #  #   ##    ##   ###   ###   ##     ##   ###
    // # ##   ##   #     # ##  #  #   #     #    #  #  #  #
    // ##     ##   #     ##    #  #   #     #    #  #  #  #
    //  ##   #  #   ##    ##   ###     ##  ###    ##   #  #
    //                         #
    /**
     * Logs an exception.
     * @param {string} message The message describing the error.
     * @param {object} [obj] The object to log.
     * @returns {void}
     */
    static exception(message, obj) {
        queue.push({
            type: "exception",
            date: new Date(),
            message,
            obj
        });
        Log.output();
    }

    //              #                 #
    //              #                 #
    //  ##   #  #  ###   ###   #  #  ###
    // #  #  #  #   #    #  #  #  #   #
    // #  #  #  #   #    #  #  #  #   #
    //  ##    ###    ##  ###    ###    ##
    //                   #
    /**
     * Outputs the log queue.
     * @returns {Promise} A promise that resolves when the output has been completed.
     */
    static async output() {
        if (running) {
            return;
        }
        running = true;

        try {
            if (!Discord) {
                Discord = require("../discord");
            }

            if (Discord.isConnected()) {
                for (const log of queue) {
                    if (log.type === "exception") {
                        if (log.obj) {
                            if (log.obj.message && log.obj.innerError && log.obj.innerError.message && log.obj.innerError.code === "ETIMEOUT") {
                                log.obj = `${log.obj.message} - ${log.obj.innerError.message} - ETIMEOUT`;
                            }

                            if (log.obj.message && log.obj.originalError && log.obj.originalError.message && log.obj.originalError.code === "ETIMEOUT") {
                                log.obj = `${log.obj.message} - ${log.obj.originalError.message} - ETIMEOUT`;
                            }

                            if (log.obj.message && log.obj.syscall && log.obj.code === "ETIMEDOUT") {
                                log.obj = `${log.obj.message} - ${log.obj.syscall} - ETIMEDOUT`;
                            }

                            if (log.obj.name === "TimeoutError") {
                                log.obj = `${log.obj.message} - TimeoutError`;
                            }

                            if (log.obj.innerError && log.obj.message && log.obj.innerError.name === "TimeoutError") {
                                log.obj = `${log.obj.message} - TimeoutError`;
                            }

                            if (log.obj.error && log.obj.message && log.obj.error.syscall && log.obj.error.code === "ETIMEDOUT") {
                                log.obj = `${log.obj.message} - ${log.obj.error.syscall} - ETIMEDOUT`;
                            }

                            if (log.obj.message && log.obj.message === "Unexpected server response: 502") {
                                log.obj = `${log.obj.message}`;
                            }

                            try {
                                const res = await request.post({
                                    uri: settings.logger.url,
                                    body: {
                                        key: settings.logger.key,
                                        application: "roncli Gaming",
                                        category: "exception",
                                        message: `${log.message}\n${util.inspect(log.obj)}`,
                                        date: new Date().getTime()
                                    },
                                    json: true
                                });

                                if (res.body.id) {
                                    await Discord.queue(`Error occurred, see ${res.body.url}.`, Discord.findTextChannelByName("botcli-errors"));
                                } else {
                                    await Discord.queue("Error occurred, problem sending log, see http://logger.roncli.com.", Discord.findTextChannelByName("botcli-errors"));
                                }
                            } catch (err) {
                                await Log.outputToDiscord(log, err);
                            }
                        } else {
                            const message = Discord.embedBuilder({
                                color: 0xFF0000,
                                fields: [],
                                timestamp: log.date.toISOString() // TODO: Remove .toISOString() once this is fixed: https://github.com/discordjs/discord.js/issues/8323
                            });

                            if (log.message) {
                                message.setDescription(log.message);
                            }

                            await Discord.richQueue(message, Discord.findTextChannelByName("botcli-errors"));
                        }
                    } else {
                        const message = Discord.embedBuilder({
                            color: log.type === "log" ? 0x80FF80 : log.type === "warning" ? 0xFFFF00 : 0xFF0000,
                            fields: [],
                            timestamp: log.date.toISOString() // TODO: Remove .toISOString() once this is fixed: https://github.com/discordjs/discord.js/issues/8323
                        });

                        if (log.message) {
                            message.setDescription(log.message);
                        }

                        await Discord.richQueue(message, Discord.findTextChannelByName("botcli-log"));
                    }
                }

                queue.splice(0, queue.length);
            } else {
                console.log(queue[queue.length - 1]);
            }
        } finally {
            running = false;
        }
    }

    //              #                 #    ###         ###    #                                #
    //              #                 #     #          #  #                                    #
    //  ##   #  #  ###   ###   #  #  ###    #     ##   #  #  ##     ###    ##    ##   ###    ###
    // #  #  #  #   #    #  #  #  #   #     #    #  #  #  #   #    ##     #     #  #  #  #  #  #
    // #  #  #  #   #    #  #  #  #   #     #    #  #  #  #   #      ##   #     #  #  #     #  #
    //  ##    ###    ##  ###    ###    ##   #     ##   ###   ###   ###     ##    ##   #      ###
    //                   #
    /**
     * Outputs a log to Discord.
     * @param {LogTypes.LogEntry} log The log to write.
     * @param {Error} err The error that caused the initial failure.
     * @returns {Promise} A promise that resolves when the output has been completed.
     */
    static async outputToDiscord(log, err) {
        let value = util.inspect(log.obj),
            continued = false;

        while (value.length > 0) {
            if (continued) {
                await Discord.queue(value.substring(0, 1024), Discord.findTextChannelByName("botcli-errors"));
            } else if (log.message) {
                const message = Discord.embedBuilder({
                    color: 0xFF0000,
                    fields: [],
                    timestamp: log.date.toISOString() // TODO: Remove .toISOString() once this is fixed: https://github.com/discordjs/discord.js/issues/8323
                });

                message.setDescription(log.message);

                message.addFields({
                    name: "Message",
                    value: value.substring(0, 1024),
                    inline: false
                });

                continued = true;

                await Discord.richQueue(message, Discord.findTextChannelByName("botcli-errors"));
            }

            value = value.substring(1024);
        }

        value = `${util.inspect(err)}`;
        continued = false;

        while (value.length > 0) {
            if (continued) {
                await Discord.queue(value.substring(0, 1024), Discord.findTextChannelByName("botcli-errors"));
            } else if (log.message) {
                const message = Discord.embedBuilder({
                    color: 0xFF0000,
                    fields: [],
                    timestamp: log.date.toISOString() // TODO: Remove .toISOString() once this is fixed: https://github.com/discordjs/discord.js/issues/8323
                });

                message.setDescription("Error while writing to logging database.");

                message.addFields({
                    name: "Message",
                    value: value.substring(0, 1024),
                    inline: false
                });

                continued = true;

                await Discord.richQueue(message, Discord.findTextChannelByName("botcli-errors"));
            }

            value = value.substring(1024);
        }
    }
}

module.exports = Log;
