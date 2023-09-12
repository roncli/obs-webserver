/**
 * @typedef {[number, number, number]} ColorArray
 */

//   ###           ##
//  #   #           #
//  #       ###     #     ###   # ##
//  #      #   #    #    #   #  ##  #
//  #      #   #    #    #   #  #
//  #   #  #   #    #    #   #  #
//   ###    ###    ###    ###   #
/**
 * A class that represents a color.
 */
class Color {
    // #
    // #
    // ###
    // #  #
    // #  #
    // ###
    /**
     * Gets the blue component of the color.
     * @returns {number} The blue component of the color.
     */
    get b() {
        return this.blue;
    }

    /**
     * Sets the blue component of the color.
     * @param {number} value The blue component of the color.
     */
    set b(value) {
        this.blue = value;
    }

    //  ###
    // #  #
    //  ##
    // #
    //  ###
    /**
     * Gets the green component of the color.
     * @returns {number} The green component of the color.
     */
    get g() {
        return this.green;
    }

    /**
     * Sets the green component of the color.
     * @param {number} value The green component of the color.
     */
    set g(value) {
        this.green = value;
    }

    // ###
    // #  #
    // #
    // #
    /**
     * Gets the red component of the color.
     * @returns {number} The red component of the color.
     */
    get r() {
        return this.red;
    }

    /**
     * Sets the red component of the color.
     * @param {number} value The red component of the color.
     */
    set r(value) {
        this.red = value;
    }

    //                           #                       #
    //                           #                       #
    //  ##    ##   ###    ###   ###   ###   #  #   ##   ###    ##   ###
    // #     #  #  #  #  ##      #    #  #  #  #  #      #    #  #  #  #
    // #     #  #  #  #    ##    #    #     #  #  #      #    #  #  #
    //  ##    ##   #  #  ###      ##  #      ###   ##     ##   ##   #
    /**
     * Creates a new instance of a color.
     * @param {number} r The red component.
     * @param {number} g The green component.
     * @param {number} b The blue component.
     */
    constructor(r, g, b) {
        this.red = r;
        this.green = g;
        this.blue = b;
    }

    //  #           ##
    //  #          #  #
    // ###    ##   #  #  ###   ###    ###  #  #
    //  #    #  #  ####  #  #  #  #  #  #  #  #
    //  #    #  #  #  #  #     #     # ##   # #
    //   ##   ##   #  #  #     #      # #    #
    //                                      #
    /**
     * Translates a color to an array.
     * @returns {ColorArray} An array representing
     */
    toArray() {
        return [this.red, this.green, this.blue];
    }
}

module.exports = Color;
