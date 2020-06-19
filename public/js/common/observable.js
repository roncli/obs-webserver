/* eslint-disable max-classes-per-file */

/**
 * @typedef {EventTarget & function} ObservableEventTarget
 */

/**
 * An event that occurs when something in an observable object changes.
 */
class ObservableEvent extends Event {
    /**
     * Creates the ObservableEvent object.
     * @param {"set" | "delete" | "change"} type The type of event.
     * @param {object} obj The raw object that got changed.
     * @param {string} key The key that got changed, hierarchy separated by dot notation.
     * @param {object} [value] The value that the key got changed to.  Not passed for deletions.
     */
    constructor(type, obj, key, value) {
        // This is an Event object, so call the Event's constructor.
        super(type);

        // Set properties specific to the event.
        this.obj = obj;
        this.key = key;
        this.value = value;
    }
}

/**
 * A class to create an observable object from an object.
 *
 * @example
 * (() => {
 *     "use strict";
 *     const car = Observable.createFrom({});
 *     car.addEventListener("set", (ev) => {console.log("I got a property set!", ev);})
 *     car.addEventListener("delete", (ev) => {console.log("I got a property deleted!", ev);})
 *     car().make = "BMW";
 *     car().model = "i128";
 *     try {
 *         car.color = "Silver";
 *     } catch (err) {
 *         console.log("Oops!  We have to set properties of our observable object on car(), not on car itself!  Also, this error won't throw unless you are in strict mode!");
 *     }
 *     car().color = "Silver";
 * })();
 */
class Observable {
    /**
     * Creates an observable object from the object passed into it.
     * @param {object} obj The object to make observable.
     * @returns {ObservableEventTarget} The observable object.
     */
    static createFrom(obj) {
        /**
         * Creates the return function.
         * @returns {Proxy} The proxy to the object to be observed.
         */
        const fx = () => fx._proxy;

        // Create an EventTarget object which will listen to changes on the object.
        fx._eventTarget = new EventTarget();

        /**
         * Creates proxy handlers.
         * @param {string} prefix A prefix to use for nested objects in the observable object.
         * @returns {ProxyHandler} The proxy handlers.
         */
        const handlers = (prefix) => ({
            set: (target, key, value) => {
                target[key] = value;
                fx._eventTarget.dispatchEvent(new ObservableEvent("set", target, `${prefix}${key}`, value));
                fx._eventTarget.dispatchEvent(new ObservableEvent("change", target, `${prefix}${key}`, value));
                return true;
            },

            deleteProperty: (target, key) => {
                delete target[key];
                fx._eventTarget.dispatchEvent(new ObservableEvent("delete", target, `${prefix}${key}`));
                fx._eventTarget.dispatchEvent(new ObservableEvent("change", target, `${prefix}${key}`));
                return true;
            },

            get: (target, key) => {
                const value = Reflect.get(target, key);
                return typeof value === "function" ? target[key] : typeof value === "object" && value !== null ? new Proxy(value, handlers(`${prefix}${key}.`)) : value;
            }
        });

        // Create our Proxy object.
        fx._proxy = new Proxy(obj, handlers(""));

        /**
         * Retrieves the methods from an object.
         * @param {object} parent The parent object.  We will look for methods on it and its children.
         * @returns {string[]} A list of methods on the object.
         */
        const getMethods = (parent) => {
            const properties = new Set();

            let currentObj = parent;

            do {
                Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item));
                currentObj = Object.getPrototypeOf(currentObj);
            } while (currentObj);
            return [...properties.keys()].filter((item) => ["caller", "callee", "arguments"].indexOf(item) === -1 && typeof parent[item] === "function");
        };

        // Get the methods for a default function and the methods on the EventTarget object we just created.
        const defaultMethods = getMethods(() => {}),
            eventTargetMethods = getMethods(fx._eventTarget);

        // For each method on the EventTarget object, create a stub on the return function that mimics the EventTarget method.
        for (const method of eventTargetMethods) {
            if (defaultMethods.indexOf(method) === -1) {
                fx[method] = (...args) => fx._eventTarget[method](...args);
            }
        }

        // Seal the return function so that it cannot be tampered with.  This prevents simple mistakes like trying to set a property on the return function and not the observable object from going undetected for long.
        Object.seal(fx);

        // Return the function, which now doubles as an EventTarget object.
        return fx;
    }
}

window.Observble = Observable;
