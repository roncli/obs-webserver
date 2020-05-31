/** @typedef {import("../../../types/viewTypes").Action} ViewTypes.Action */

//    #            #       #                         #   #    #
//   # #           #                                 #   #
//  #   #   ###   ####    ##     ###   # ##    ###   #   #   ##     ###   #   #
//  #   #  #   #   #       #    #   #  ##  #  #       # #     #    #   #  #   #
//  #####  #       #       #    #   #  #   #   ###    # #     #    #####  # # #
//  #   #  #   #   #  #    #    #   #  #   #      #   # #     #    #      # # #
//  #   #   ###     ##    ###    ###   #   #  ####     #     ###    ###    # #
/**
 * A class that represents the actions settings view.
 */
class ActionsView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered actions settings template.
     * @param {{data: ViewTypes.Action[]}} actions The actions to render.
     * @returns {string} An HTML string of the actions settings view.
     */
    static get(actions) {
        return /* html */`
            <div>
                Actions<br />
                ${actions.data.map((a) => ActionsView.ActionView.get(a)).join("")}
                ${ActionsView.ActionView.get({}, true)}
                <button class="settings-save" data-key="actions">Save</button>
                <button class="settings-cancel">Cancel</button>
            </div>
        `;
    }
}

/** @type {typeof import("./action")} */
// @ts-ignore
ActionsView.ActionView = typeof ActionView === "undefined" ? require("./action") : ActionView; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.ActionsView = ActionsView;
} else {
    module.exports = ActionsView; // eslint-disable-line no-undef
}
