/**
 * @typedef {import("../../../types/viewTypes").Command} ViewTypes.Command
 */

// MARK: class CommandsView
/**
 * A class that represents the commands settings view.
 */
class CommandsView {
    // MARK: static get
    /**
     * Gets the rendered commands settings template.
     * @param {{data: ViewTypes.Command[]}} commands The commands to render.
     * @returns {string} An HTML string of the commands settings view.
     */
    static get(commands) {
        return /* html */`
            <div>
                Commands<br />
                ${commands.data.map((a) => CommandsView.CommandView.get(a)).join("")}
                ${CommandsView.CommandView.get({}, true)}
                <button class="settings-save" data-key="commands">Save</button>
                <button class="settings-cancel">Cancel</button>
            </div>
        `;
    }
}

/** @type {typeof import("./command")} */
// @ts-ignore
CommandsView.CommandView = typeof CommandView === "undefined" ? require("./command") : CommandView; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.CommandsView = CommandsView;
} else {
    module.exports = CommandsView; // eslint-disable-line no-undef
}
