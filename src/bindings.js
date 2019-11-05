const bindingTypes = require('./binding-types')
const isClass = require('./is-class')
const { NoBindingError, NoNClassBindingError } = require('./binding-errors')

class Binder {
    constructor(bindings) {
        this.bindings = bindings
    }
    setKey(key) {
        this.key = key
        return this
    }
    /**
     * Binds key to Class
     * @param {Class<any>} value
     * @returns {Binder}
     */
    toClass(value) {
        if (!isClass(value)) {
            throw new NoNClassBindingError(value)
        }
        this.bindings.setBinding(this.key, bindingTypes.CLASS, value)
        return this
    }
    /**
     * Binds key to Value
     * @param {*} value
     */
    toValue(value) {
        this.bindings.setBinding(this.key, bindingTypes.VALUE, value)
    }
    /**
     * Binds key to other key in bindings
     * @param {string} srcKey
     * @returns {Binder}
     */
    toKey(srcKey) {
        const { type, value } = this.bindings.getBinding(srcKey)
        this.bindings.setBinding(this.key, type, value)
        return this
    }
    /**
     * Marks binding as Singleton
     */
    asSingleton() {
        const { type, value } = this.bindings.getBinding(this.key)
        if (type !== bindingTypes.CLASS) {
            throw new NoNClassBindingError(value)
        }
        this.bindings.setBinding(this.key, bindingTypes.SINGLETON, value)
    }
}

/**
 * @typedef {Object} Binding
 * @property {bindingTypes} type
 * @property {*} value
 */

class Bindings {
    constructor() {
        this.bindings = new Map()
        this.binder = new Binder(this)
    }
    upKey(key) {
        return key.toUpperCase()
    }
    /**
     * Returns binding for key
     * @param {string} key 
     * @returns {Binding} Binding for key
     * @throws {NoBindingError} if there is not binding for key
     */
    getBinding(key) {
        const uKey = this.upKey(key)
        if (this.hasBinding(uKey)) {
            return this.bindings.get(uKey)
        }
        throw new NoBindingError(key)
    }
    setBinding(key, type, value) {
        const uKey = this.upKey(key)
        this.bindings.set(uKey, { type, value })
    }
    /**
     * Check if there is binding for specific key
     * @param {string} key 
     * @returns {Boolean}
     */
    hasBinding(key) {
        const uKey = this.upKey(key)
        return this.bindings.has(uKey)
    }
    /**
     * Bind key to either Class, Value or other Key
     * @param {string} key 
     */
    bind(key) {
        return this.binder.setKey(key)
    }
    bindClass(...classes) {
        classes.forEach(cls => {
            if (!isClass(cls)) {
                throw new NoNClassBindingError(cls)
            }
            const key = this.upKey(cls.name)
            this.setBinding(key, bindingTypes.CLASS, cls)
        })
    }
}

module.exports = Bindings