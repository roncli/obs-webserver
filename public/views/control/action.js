/**
 * @typedef {import("../../../types/viewTypes").Action} ViewTypes.Action
 */

// MARK: class ActionView
/**
 * A class that represents the action settings view.
 */
class ActionView {
    // MARK: static get
    /**
     * Gets the rendered action setting template.
     * @param {ViewTypes.Action} action The action to render.
     * @param {boolean} [add] Whether this is a new row to add or an existing row to remove.
     * @returns {string} An HTML string of the action settings view.
     */
    static get(action, add) {
        return /* html */`
            <div class="settings-row${add ? " settings-new" : ""}">
                ${add ? "" : /* html */`
                    <span draggable="true" class="draggable emoji">↕</span>
                `}
                Name: <input type="text" data-field="name" value="${ActionView.Common.htmlEncode(action.name)}" />
                Overlay Trigger: <input type="text" data-field="overlay" value="${ActionView.Common.htmlEncode(action.overlay)}" />
                Sound Path: <input type="text" data-field="soundPath" value="${ActionView.Common.htmlEncode(action.soundPath)}" />
                <button class="emoji ${add ? "add" : "remove"}">${add ? "➕" : "❌"}</button>
            </div>
        `;
    }
}

/** @type {typeof import("../../../web/includes/common")} */
// @ts-ignore
ActionView.Common = typeof Common === "undefined" ? require("../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.ActionView = ActionView;
} else {
    module.exports = ActionView; // eslint-disable-line no-undef
}
