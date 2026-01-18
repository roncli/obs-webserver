/**
 * @typedef {import("../../../types/viewTypes").Command} ViewTypes.Command
 */

// MARK: class CommandView
/**
 * A class that represents the command settings view.
 */
class CommandView {
    // MARK: static get
    /**
     * Gets the rendered command setting template.
     * @param {ViewTypes.Command} command The command to render.
     * @param {boolean} [add] Whether this is a new row to add or an existing row to remove.
     * @returns {string} An HTML string of the command settings view.
     */
    static get(command, add) {
        return /* html */`
            <div class="settings-row${add ? " settings-new" : ""}">
                ${add ? "" : /* html */`
                    <span draggable="true" class="draggable emoji">↕</span>
                `}
                Name: <input type="text" data-field="name" value="${CommandView.Common.htmlEncode(command.name)}" />
                Text: <input type="text" data-field="text" style="width: 500px;" value="${CommandView.Common.htmlEncode(command.text)}" />
                Enabled: <input type="checkbox" data-field="enabled" ${command.enabled ? "checked" : ""} />
                <button class="emoji ${add ? "add" : "remove"}">${add ? "➕" : "❌"}</button>
            </div>
        `;
    }
}

/** @type {typeof import("../../../web/includes/common")} */
// @ts-ignore
CommandView.Common = typeof Common === "undefined" ? require("../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.CommandView = CommandView;
} else {
    module.exports = CommandView; // eslint-disable-line no-undef
}
