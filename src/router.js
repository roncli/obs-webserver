/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 * @typedef {import("express").Router} Express.Router
 */

const fs = require("fs"),
    path = require("path"),
    promisify = require("util").promisify,

    express = require("express"),

    Log = require("./logging/log"),
    classes = {};

//  ####                  #
//  #   #                 #
//  #   #   ###   #   #  ####    ###   # ##
//  ####   #   #  #   #   #     #   #  ##  #
//  # #    #   #  #   #   #     #####  #
//  #  #   #   #  #  ##   #  #  #      #
//  #   #   ###    ## #    ##    ###   #
/**
 * A class that handles the router for the website.
 */
class Router {
    //       #                 #      ##               #
    //       #                 #     #  #              #
    //  ##   ###    ##    ##   # #   #      ###   ##   ###    ##
    // #     #  #  # ##  #     ##    #     #  #  #     #  #  # ##
    // #     #  #  ##    #     # #   #  #  # ##  #     #  #  ##
    //  ##   #  #   ##    ##   #  #   ##    # #   ##   #  #   ##
    /**
     * Checks the cache and refreshes it if necessary.
     * @param {string} file The name of the class.
     * @returns {Promise} A promise that resolves once the cache is checked.
     */
    static async checkCache(file) {
        const classInfo = classes[file];

        if (!classInfo) {
            throw new Error("Invald class name.");
        }

        const stats = await promisify(fs.stat)(require.resolve(classInfo.file));

        if (!classInfo.lastModified || classInfo.lastModified !== stats.mtime) {
            delete require.cache[require.resolve(classInfo.file)];
            classInfo.class = require(classInfo.file);
            classInfo.lastModified = stats.mtime;
        }
    }

    //              #     ##   ##
    //              #    #  #   #
    //  ###   ##   ###   #      #     ###   ###    ###    ##    ###
    // #  #  # ##   #    #      #    #  #  ##     ##     # ##  ##
    //  ##   ##     #    #  #   #    # ##    ##     ##   ##      ##
    // #      ##     ##   ##   ###    # #  ###    ###     ##   ###
    //  ###
    /**
     * Gets all of the available classes.
     * @param {string} dir The directory to get the classes for.
     * @returns {Promise} A promise that resolves when all the classes are retrieved.
     */
    static async getClasses(dir) {
        const list = await promisify(fs.readdir)(dir);

        for (const file of list) {
            const filename = path.resolve(dir, file);

            const stat = await promisify(fs.stat)(filename);

            if (stat && stat.isDirectory()) {
                await Router.getClasses(filename);
            } else {
                const classInfo = require(filename);
                classes[filename] = classInfo.route;
                if (classInfo.route.webSocket) {
                    classes[filename].events = Object.getOwnPropertyNames(classInfo).filter((p) => typeof classInfo[p] === "function");
                } else if (!classInfo.route.include) {
                    classes[filename].methods = Object.getOwnPropertyNames(classInfo).filter((p) => typeof classInfo[p] === "function");
                }
                classes[filename].file = filename;
                Router.checkCache(filename);
            }
        }
    }

    //              #    ###                #
    //              #    #  #               #
    //  ###   ##   ###   #  #   ##   #  #  ###    ##   ###
    // #  #  # ##   #    ###   #  #  #  #   #    # ##  #  #
    //  ##   ##     #    # #   #  #  #  #   #    ##    #
    // #      ##     ##  #  #   ##    ###    ##   ##   #
    //  ###
    /**
     * Gets the router to use for the website.
     * @returns {Promise<Express.Router>} A promise that resolves with the router to use for the website.
     */
    static async getRouter() {
        await Router.getClasses(`${__dirname}/../web`);

        const router = express.Router(),
            filenames = Object.keys(classes),
            includes = filenames.filter((c) => classes[c].include),
            webSockets = filenames.filter((c) => classes[c].webSocket),
            pages = filenames.filter((c) => !classes[c].include && !classes[c].webSocket && classes[c].path && classes[c].methods && classes[c].methods.length > 0);

        webSockets.forEach((filename) => {
            const classInfo = classes[filename];

            router.ws(classInfo.path, (ws, req) => {
                ws.url = req.url.replace("/.websocket", "").replace(".websocket", "") || "/";

                classInfo.events.forEach((event) => {
                    ws.on(event, (...args) => {
                        classInfo.class[event](ws, ...args);
                    });
                });

                ws.emit("init");
            });
        });

        pages.forEach((filename) => {
            const classInfo = classes[filename];

            classInfo.methods.forEach((method) => {
                router[method](classInfo.path, async (/** @type {Express.Request} */ req, /** @type {Express.Response} */ res, /** @type {function} */ next) => {
                    try {
                        for (const include of includes) {
                            await Router.checkCache(include);
                        }
                        await Router.checkCache(filename);

                        if (!classInfo.class[req.method.toLowerCase()]) {
                            return classes[path.resolve(`${__dirname}/../web/controllers/405.js`)].class.get(req, res, next);
                        }

                        return await classInfo.class[req.method.toLowerCase()](req, res, next);
                    } catch (err) {
                        Log.exception(`A web exception occurred in ${req.method.toLowerCase()} ${classInfo.path} from ${(req.headers["x-forwarded-for"] ? `${req.headers["x-forwarded-for"]}` : void 0) || req.ip} for ${req.url}.`, err);
                    }

                    return classes[path.resolve(`${__dirname}/../web/controllers/500.js`)].class.get(req, res, next);
                });
            });
        });

        return router;
    }
}

module.exports = Router;
