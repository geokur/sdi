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
    toClass(value) {
        if (!isClass(value)) {
            throw new NoNClassBindingError(value)
        }
        this.bindings.setBinding(this.key, bindingTypes.CLASS, value)
        return this
    }
    toValue(value) {
        this.bindings.setBinding(this.key, bindingTypes.VALUE, value)
    }
    toKey(srcKey) {
        const { type, value } = this.bindings.getBinding(srcKey)
        this.bindings.setBinding(this.key, type, value)
        return this
    }
    asSingleton() {
        const { type, value } = this.bindings.getBinding(this.key)
        if (type !== bindingTypes.CLASS) {
            throw new NoNClassBindingError(value)
        }
        this.bindings.setBinding(this.key, bindingTypes.SINGLETON, value)
    }
}

class Bindings {
    constructor() {
        this.bindings = new Map()
        this.binder = new Binder(this)
    }
    upKey(key) {
        return key.toUpperCase()
    }
    getBinding(key) {
        const uKey = this.upKey(key)
        if (this.bindings.has(uKey)) {
            return this.bindings.get(uKey)
        }
        throw new NoBindingError(key)
    }
    setBinding(key, type, value) {
        const uKey = this.upKey(key)
        this.bindings.set(uKey, { type, value })
    }
    bind(key) {
        return this.binder.setKey(key)
    }
}

module.exports = Bindings