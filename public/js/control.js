//   ###                  #                    ##
//  #   #                 #                     #
//  #       ###   # ##   ####   # ##    ###     #
//  #      #   #  ##  #   #     ##  #  #   #    #
//  #      #   #  #   #   #     #      #   #    #
//  #   #  #   #  #   #   #  #  #      #   #    #
//   ###    ###   #   #    ##   #       ###    ###
/**
 * A class that provides functions for the control page.
 */
class Control {
    // ###    ##   #  #   ##                #                 #    #                    #           #
    // #  #  #  #  ####  #  #               #                 #    #                    #           #
    // #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
    // #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
    // #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
    // ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
    /**
     * Sets up the page's events.
     * @returns {void}
     */
    static DOMContentLoaded() {
        Control.startWebsocket();

        document.getElementById("scenes").addEventListener("click", async (ev) => {
            /** @type {HTMLButtonElement} */
            const button = ev.target;

            if (button && button.matches("button#scene-go")) {
                /** @type {HTMLSelectElement} */
                const sceneList = document.getElementById("scene-list");

                const scene = sceneList.options[sceneList.selectedIndex];

                await window.Common.loadTemplate(scene.dataset.path, scene.dataset.class);

                await window.Common.loadDataIntoTemplate(scene.dataset.api || null, "#scene", window[scene.dataset.class].get);
            }
        });

        document.getElementById("scene").addEventListener("click", (ev) => {
            /** @type {HTMLButtonElement} */
            const button = ev.target;

            if (button && button.matches("button.transition")) {
                Control.ws.send(JSON.stringify({
                    type: "transition",
                    scene: button.dataset.transition
                }));
            }

            if (button && button.matches("button#update-twitch")) {
                Control.ws.send(JSON.stringify({
                    type: "update-twitch"
                }));
            }
        });

        document.getElementById("scene").addEventListener("focusout", async (ev) => {
            if (ev.target && (ev.target.matches("textarea.setting") || ev.target.matches("input[type=\"text\"].setting"))) {
                /** @type {HTMLTextAreaElement} */
                const parent = ev.target.parentElement,
                    api = parent.dataset.api,
                    objects = {};

                parent.querySelectorAll(".setting").forEach((el) => {
                    objects[el.dataset.type] = el.value;
                });

                await fetch(api, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(objects)
                });
            }
        }, false);

        document.getElementById("discord").addEventListener("click", (ev) => {
            /** @type {HTMLButtonElement} */
            const button = ev.target;

            if (button && button.matches("button#channel-go")) {
                /** @type {HTMLSelectElement} */
                const channelList = document.getElementById("channel-list");

                const channel = channelList.options[channelList.selectedIndex];

                Control.ws.send(JSON.stringify({
                    type: "discord",
                    data: {
                        name: channel.value,
                        guildId: channel.dataset.guildId,
                        channelId: channel.dataset.channelId
                    }
                }));
            }
        });

        document.getElementById("music").addEventListener("click", (ev) => {
            /** @type {HTMLButtonElement} */
            const button = ev.target;

            if (button && button.matches("button.music-play")) {
                /** @type {HTMLSelectElement} */
                const musicList = document.getElementById("music-list");

                const music = musicList.options[musicList.selectedIndex];

                Control.ws.send(JSON.stringify({
                    type: "music",
                    data: {
                        command: "play",
                        name: music.value,
                        uri: music.dataset.uri,
                        volume: button.dataset.volume
                    }
                }));
            }

            if (button && button.matches("button#music-stop")) {
                Control.ws.send(JSON.stringify({
                    type: "music",
                    data: {
                        command: "stop"
                    }
                }));
            }
        });

        document.getElementById("actions").addEventListener("click", (ev) => {
            /** @type {HTMLButtonElement} */
            const button = ev.target;

            if (button && button.matches("button#action-go")) {
                /** @type {HTMLSelectElement} */
                const actionList = document.getElementById("action-list");

                const action = actionList.options[actionList.selectedIndex];

                Control.ws.send(JSON.stringify({
                    type: "action",
                    data: {
                        name: action.value,
                        overlay: action.dataset.overlay,
                        soundPath: action.dataset.soundPath
                    }
                }));
            }
        });

        let settingTemplate;
        let settingApi;

        document.getElementById("settings").addEventListener("click", async (ev) => {
            /** @type {HTMLButtonElement} */
            const button = ev.target;

            if (button && button.matches("button.setting")) {
                await window.Common.loadTemplate(button.dataset.path, button.dataset.class);

                settingTemplate = window[button.dataset.subclass].get;
                settingApi = button.dataset.api;

                await window.Common.loadDataIntoTemplate(settingApi, "#setting", window[button.dataset.class].get);
            }
        });

        document.getElementById("setting").addEventListener("click", async (ev) => {
            /** @type {HTMLButtonElement} */
            const button = ev.target;

            if (button && button.matches("button.remove")) {
                button.parentElement.remove();
            }

            if (button && button.matches("button.add")) {
                const obj = {};

                Array.from(button.parentElement.children).forEach((child) => {
                    if (child.dataset && child.dataset.field) {
                        if (child instanceof HTMLInputElement) {
                            /** @type {HTMLInputElement} */
                            const inputEl = child;

                            switch (inputEl.type) {
                                case "text":
                                    obj[inputEl.dataset.field] = inputEl.value;
                                    inputEl.value = "";
                                    break;
                                case "checkbox":
                                    obj[inputEl.dataset.field] = inputEl.checked;
                                    inputEl.checked = false;
                                    break;
                            }

                        } else if (child instanceof HTMLSelectElement) {
                            /** @type {HTMLSelectElement} */
                            const selectEl = child;

                            obj[selectEl.dataset.field] = selectEl.options[selectEl.selectedIndex].value;

                            selectEl.selectedIndex = 0;
                        }
                    }
                });

                document.querySelector("#setting div.settings-new").insertAdjacentHTML("beforebegin", settingTemplate(obj));
            }

            if (button && button.matches("button.settings-cancel")) {
                document.getElementById("setting").innerHTML = "";
            }

            if (button && button.matches("button.settings-save")) {
                const objects = [];

                document.querySelectorAll("div.settings-row").forEach((row) => {
                    if (!row.classList.contains("settings-new")) {
                        const obj = {};

                        Array.from(row.children).forEach((child) => {
                            if (child.dataset && child.dataset.field) {
                                if (child instanceof HTMLInputElement) {
                                    /** @type {HTMLInputElement} */
                                    const inputEl = child;

                                    switch (inputEl.type) {
                                        case "text":
                                            obj[inputEl.dataset.field] = inputEl.value;
                                            break;
                                        case "checkbox":
                                            obj[inputEl.dataset.field] = inputEl.checked;
                                            break;
                                    }
                                } else if (child instanceof HTMLSelectElement) {
                                    /** @type {HTMLSelectElement} */
                                    const selectEl = child;

                                    obj[selectEl.dataset.field] = selectEl.options[selectEl.selectedIndex].value;
                                }
                            }
                        });

                        objects.push(obj);
                    }
                });

                const res = await fetch(settingApi, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(objects)
                });

                if (res.status === 204) {
                    document.getElementById("setting").innerHTML = "";
                }
            }
        });

        let selected;

        document.getElementById("setting").addEventListener("dragstart", (ev) => {
            ev.dataTransfer.effectAllowed = "move";
            ev.dataTransfer.setData("text/html", null);
            selected = ev.target.parentElement;
        });

        document.getElementById("setting").addEventListener("dragover", (ev) => {
            /** @type {HTMLElement} */
            let el = ev.target;

            while (el && (!el.classList.contains("settings-row") || el.classList.contains("settings-new"))) {
                el = el.parentElement;
            }

            if (!el) {
                return;
            }

            let isBefore = false;
            if (selected.parentNode === el.parentNode) {
                for (let current = selected.previousSibling; current; current = current.previousSibling) {
                    if (current === el) {
                        isBefore = true;
                        break;
                    }
                }
            }

            if (isBefore) {
                el.parentNode.insertBefore(selected, el);
            } else {
                el.parentNode.insertBefore(selected, el.nextSibling);
            }
        });

        document.getElementById("setting").addEventListener("dragend", () => {
            selected = null;
        });
    }

    //         #                 #    #  #        #                        #            #
    //         #                 #    #  #        #                        #            #
    //  ###   ###    ###  ###   ###   #  #   ##   ###    ###    ##    ##   # #    ##   ###
    // ##      #    #  #  #  #   #    ####  # ##  #  #  ##     #  #  #     ##    # ##   #
    //   ##    #    # ##  #      #    ####  ##    #  #    ##   #  #  #     # #   ##     #
    // ###      ##   # #  #       ##  #  #   ##   ###   ###     ##    ##   #  #   ##     ##
    /**
     * Starts the WebSocket connection.
     * @returns {void}
     */
    static startWebsocket() {
        /** @type {WebSocket} */
        Control.ws = new WebSocket("ws://" + document.location.hostname + ":" + (document.location.port || "80") + "/");

        Control.ws.onmessage = (ev) => {
            const data = JSON.parse(ev.data);

            switch (data.type) {
                case "settings":
                    switch (data.data.type) {
                        case "actions": {
                            /** @type {HTMLSelectElement} */
                            const select = document.getElementById("action-list");

                            select.innerHTML = "";

                            for (const action of data.data.data) {
                                const option = new Option(action.name);
                                option.classList.add("action");
                                option.dataset.overlay = action.overlay;
                                option.dataset.soundPath = action.soundPath;
                                select.add(option);
                            }
                            break;
                        }
                        case "discordChannels": {
                            /** @type {HTMLSelectElement} */
                            const select = document.getElementById("channel-list");

                            select.innerHTML = "";

                            for (const channel of data.data.data) {
                                const option = new Option(channel.name);
                                option.classList.add("channel");
                                option.dataset.guildId = channel.guildId;
                                option.dataset.channelId = channel.channelId;
                                select.add(option);
                            }
                            break;
                        }
                        case "spotifyPlaylists": {
                            /** @type {HTMLSelectElement} */
                            const select = document.getElementById("music-list");

                            select.innerHTML = "";

                            for (const music of data.data.data) {
                                const option = new Option(music.name);
                                option.classList.add("music");
                                option.dataset.uri = music.uri;
                                select.add(option);
                            }
                            break;
                        }
                    }
                    break;
                case "error":

                    break;
                default:
                    break;
            }
        };
    }
}

/** @type {WebSocket} */
Control.ws = void 0;

document.addEventListener("DOMContentLoaded", Control.DOMContentLoaded);

window.Control = Control;
