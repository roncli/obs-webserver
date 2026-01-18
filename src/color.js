/**
 * @typedef {[number, number, number]} ColorArray
 */

// MARK: class Color
/**
 * A class that represents a color.
 */
class Color {
    // MARK: get b
    /**
     * Gets the blue component of the color.
     * @returns {number} The blue component of the color.
     */
    get b() {
        return this.blue;
    }

    // MARK: set b
    /**
     * Sets the blue component of the color.
     * @param {number} value The blue component of the color.
     */
    set b(value) {
        this.blue = value;
    }

    // MARK: get g
    /**
     * Gets the green component of the color.
     * @returns {number} The green component of the color.
     */
    get g() {
        return this.green;
    }

    // MARK: set g
    /**
     * Sets the green component of the color.
     * @param {number} value The green component of the color.
     */
    set g(value) {
        this.green = value;
    }

    // MARK: get r
    /**
     * Gets the red component of the color.
     * @returns {number} The red component of the color.
     */
    get r() {
        return this.red;
    }

    // MARK: set r
    /**
     * Sets the red component of the color.
     * @param {number} value The red component of the color.
     */
    set r(value) {
        this.red = value;
    }

    // MARK: constructor
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

    // MARK: toArray
    /**
     * Translates a color to an array.
     * @returns {ColorArray} An array representing
     */
    toArray() {
        return [this.red, this.green, this.blue];
    }
}

module.exports = Color;
