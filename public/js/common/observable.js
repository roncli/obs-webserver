/**
 * A thing.
 */
class ObservableEvent extends Event { // eslint-disable-line max-classes-per-file
    /**
     * A thing.
     * @param {string} type A thing.
     * @param {object} obj A thing.
     * @param {string} key A thing.
     * @param {object} value A thing.
     */
    constructor(type, obj, key, value) {
        super(type);
        this.obj = obj;
        this.key = key;
        this.value = value;
    }
}

/**
 * A thing.
 */
class ObservableEventTarget extends EventTarget {
    /**
     * A thing.
     * @param {object} obj A thing.
     * @returns {object} A thing.
     */
    observe(obj) {
        if (this.observing) {
            throw Error("This ObserverEventTarget is already observing an object.  Create a new ObserverEventTarget to observe a new object.");
        }

        this.observing = true;

        /**
         * A thing.
         * @param {string} prefix A thing.
         * @returns {ProxyHandler} A thing.
         */
        const handlers = (prefix) => ({
            set: (target, key, value) => {
                target[key] = value;
                this.dispatchEvent(new ObservableEvent("set", target, `${prefix}${key}`, value));
            },

            deleteProperty: (target, key) => {
                delete target[key];
                this.dispatchEvent(new ObservableEvent("delete", target, `${prefix}${key}`));
            },

            get: (target, key) => {
                const value = Reflect.get(target, key);
                return typeof value === "function" ? value.bind(target) : typeof value === "object" && value !== null ? new Proxy(value, handlers(`${prefix}${key}.`)) : value;
            }
        });

        return new Proxy(obj, handlers(""));
    }
}

const a = new ObservableEventTarget();

a.addEventListener("set", (ev) => {
    console.log(ev);
});

a.addEventListener("delete", (ev) => {
    console.log(ev);
});

const b = {};

const c = a.observe(b);

c.a = 1;
c.b = 2;
c.c = () => {
    console.log("HI!");
};
c.d = {a: 1};
c.d.b = 2;
delete c.b;

c.c();

const d = [];

const e = a.observe(d);

e.push(1);
e.push(2);
e.push(3);
e[1] = 4;
