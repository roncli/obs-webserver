/**
 * @typedef {{[x: string]: string}} Settings
 */

const nconf = require("nconf"),
    path = require("path");

//   ###                   ##     #           #####    #     ##
//  #   #                 #  #                #               #
//  #       ###   # ##    #      ##     ## #  #       ##      #     ###
//  #      #   #  ##  #  ####     #    #  #   ####     #      #    #   #
//  #      #   #  #   #   #       #     ##    #        #      #    #####
//  #   #  #   #  #   #   #       #    #      #        #      #    #
//   ###    ###   #   #   #      ###    ###   #       ###    ###    ###
//                                     #   #
//                                      ###
/**
 * A class to handle saving configuration settings.
 */
class ConfigFile {
    //               #
    //               #
    //  ###    ##   ###   #  #  ###
    // ##     # ##   #    #  #  #  #
    //   ##   ##     #    #  #  #  #
    // ###     ##     ##   ###  ###
    //                          #
    /**
     * Sets up the configuration.
     * @returns {void}
     */
    static setup() {
        nconf.file({
            file: path.join(__dirname, "../config.json")
        });
    }

    //               #
    //               #
    //  ###    ##   ###
    // ##     # ##   #
    //   ##   ##     #
    // ###     ##     ##
    /**
     * Updates the settings on the config.
     * @param {Settings} settings The settings to save into the configuration.
     * @returns {Promise} A promise that resolves when the settings have been updated on the config.
     */
    static set(settings) {
        Object.keys(settings).forEach((key) => {
            nconf.set(key, settings[key]);
        });

        return new Promise((resolve, reject) => {
            nconf.save((err) => {
                if (err) {
                    reject(err);
                }

                resolve();
            });
        });
    }

    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Retrieves a setting from the config.
     * @param {string} key The key to get the settings for.
     * @returns {any} The value on the config.
     */
    static get(key) {
        return nconf.get(key);
    }
}

module.exports = ConfigFile;
