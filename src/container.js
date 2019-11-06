const Dependencies = require('./dependencies')
const Bindings = require('./bindings')
const bindingTypes = require('./binding-types')
const { NoBindingError } = require('./binding-errors')


class Container {
    constructor(bindings = new Bindings()) {
        this.bindings = bindings
        this.singletons = new Map()
        this.dependencies = new Dependencies(this)
        this.containers = new Set()
    }
    addContainer(...containers) {
        for (let container of containers) {
            this.containers.add(container)
        }
    }
    getInstance(key) {
        if (this.bindings.hasBinding(key)) {
            return this._getInstance(key)
        } else {
            const container = this._getContainer(key)
            return container.getInstance(key)
        }
    }
    _getContainer(key) {
        for (let container of this.containers.values()) {
            if (container.bindings.hasBinding(key)) {
                return container
            }
        }
        throw new NoBindingError(key)
    }
    _getClassInstance(Class) {
        return new Class(this.dependencies)
    }
    _getSingleton(key, Class) {
        if (!this.singletons.has(key)) {
            const instance = this._getClassInstance(Class)
            this.singletons.set(key, instance)
        }
        return this.singletons.get(key)
    }
    _getInstance(key) {
        const { type, value } = this.bindings.getBinding(key)
        switch (type) {
            case bindingTypes.CLASS:
                return  this._getClassInstance(value)
            case bindingTypes.SINGLETON:
                return this._getSingleton(key, value)
            case bindingTypes.VALUE:
                return value
        }
    }
}

module.exports = Container