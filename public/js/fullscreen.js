//  #####          ##     ##
//  #               #      #
//  #      #   #    #      #     ###    ###   # ##    ###    ###   # ##
//  ####   #   #    #      #    #      #   #  ##  #  #   #  #   #  ##  #
//  #      #   #    #      #     ###   #      #      #####  #####  #   #
//  #      #  ##    #      #        #  #   #  #      #      #      #   #
//  #       ## #   ###    ###   ####    ###   #       ###    ###   #   #
/**
 * A class of static functions for the fullscreen page.
 */
class Fullscreen {
    //                #         #          #  #   #       #
    //                #         #          #  #           #
    // #  #  ###    ###   ###  ###    ##   #  #  ##     ###   ##    ##
    // #  #  #  #  #  #  #  #   #    # ##  #  #   #    #  #  # ##  #  #
    // #  #  #  #  #  #  # ##   #    ##     ##    #    #  #  ##    #  #
    //  ###  ###    ###   # #    ##   ##    ##   ###    ###   ##    ##
    //       #
    /**
     * Updates the specified video element with the web cam feed.
     * @param {string} element The element to update.
     * @returns {Promise} A promise that returns when the video element is updated.
     */
    static async updateVideo(element) {
        const video = document.querySelector(element),
            devices = await navigator.mediaDevices.enumerateDevices(),
            {deviceId} = devices.filter((d) => d.kind === "videoinput" && d.label.startsWith("Logitech HD Pro Webcam C920"))[0];

        navigator.webkitGetUserMedia({
            video: {
                mandatory: {
                    minWidth: 1920,
                    minHeight: 1080
                },
                optional: [{sourceId: deviceId}]
            }
        }, (stream) => {
            video.srcObject = stream;
        }, (err) => {
            console.log(err);
        });
    }

    // ###    ##   #  #   ##                #                 #    #                    #           #
    // #  #  #  #  ####  #  #               #                 #    #                    #           #
    // #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
    // #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
    // #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
    // ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
    /**
     * Starts up the index page.
     * @returns {void}
     */
    static DOMContentLoaded() {
        Fullscreen.updateVideo("#webcam");
    }
}

document.addEventListener("DOMContentLoaded", Fullscreen.DOMContentLoaded);
