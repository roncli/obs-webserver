/**
 * @typedef {import("../../types/viewTypes").Option} ViewTypes.Option
 */

// MARK: class Common
/**
 * A class that provides common functions.
 */
class Common {
    // MARK: static htmlEncode
    /**
     * HTML-encodes a string.
     * @param {string} str The string.
     * @returns {string} The encoded string.
     */
    static htmlEncode(str) {
        return str && str.replace(/[\u0080-\uFFFF<>&]/gim, (i) => `&#${i.charCodeAt(0)};`) || "";
    }

    // MARK: static generateOptions
    /**
     * Generates an HTML string of options.
     * @param {ViewTypes.Option[]} options The options.
     * @param {string} [selected] The selected value.
     * @param {boolean} [includeEmpty] Whether to include an empty option.
     * @returns {string} The HTML string of options.
     */
    static generateOptions(options, selected, includeEmpty) {
        return /* html */`
            ${includeEmpty ? /* html */`
                <option value=""${!selected || selected === "" ? " selected" : ""}></option>
            ` : ""}
            ${options.map((o) => /* html */`
                <option value="${Common.htmlEncode(o.value)}"${selected === o.value ? " selected" : ""}>${Common.htmlEncode(o.text || o.value)}</option>
            `)}
        `;
    }

    // MARK: static async loadTemplate
    /**
     * Load a template into memory.
     * @param {string} path The path of the template.
     * @param {string} className The name of the class.
     * @returns {Promise} A promise that resolves when the template is loaded.
     */
    static async loadTemplate(path, className) {
        if (window[className]) {
            return;
        }

        const script = document.createElement("script");

        await new Promise((resolve) => {
            script.onload = () => {
                resolve();
            };
            script.src = path;

            document.head.appendChild(script);
        });
    }

    // MARK: static async loadDataIntoTemplate
    /**
     * Loads data from an API into an element.
     * @param {string} api The API to load data from, or null if no data is needed.
     * @param {string} querySelector The query selector to fill the data into.
     * @param {function} template The template function.
     * @returns {Promise} A promise that resolves when the data has been loaded.
     */
    static async loadDataIntoTemplate(api, querySelector, template) {
        var el = document.querySelector(querySelector);

        el.innerHTML = /* html */`
            <div class="loading">Loading...</div>
        `;

        if (api) {
            const data = await (await fetch(api)).json();

            if (Array.isArray(data)) {
                el.innerHTML = "";
                data.forEach((item) => {
                    el.insertAdjacentHTML("beforeend", template(item));
                });
            } else {
                el.innerHTML = template(data);
            }
        } else {
            el.innerHTML = template();
        }
    }
}

window.Common = Common;
