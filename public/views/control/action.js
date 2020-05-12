/** @typedef {import("../../../types/viewTypes").Action} ViewTypes.Action */

//    #            #       #                  #   #    #
//   # #           #                          #   #
//  #   #   ###   ####    ##     ###   # ##   #   #   ##     ###   #   #
//  #   #  #   #   #       #    #   #  ##  #   # #     #    #   #  #   #
//  #####  #       #       #    #   #  #   #   # #     #    #####  # # #
//  #   #  #   #   #  #    #    #   #  #   #   # #     #    #      # # #
//  #   #   ###     ##    ###    ###   #   #    #     ###    ###    # #
/**
 * A class that represents the action settings view.
 */
class ActionView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
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
                Sound Path: <input type="text" data-field="soundPath" value="${ActionView.Common.htmlEncode(action.soundPath)}" />
                Image Path: <input type="text" data-field="imagePath" value="${ActionView.Common.htmlEncode(action.imagePath)}" />
                Image Location:
                <select data-field="imageLocation">
                    ${ActionView.Common.generateOptions([{value: "Webcam"}], action.imageLocation, true)}
                </select>
                Reward: <input type="text" data-field="reward" value="${ActionView.Common.htmlEncode(action.reward)}" />
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
