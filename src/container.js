const Dependencies = require('./dependencies')
const bindingTypes = require('./binding-types')

class Container {
    constructor(bindings) {
        this.bindings = bindings
        this.singletons = new Map()
        this.dependencies = new Dependencies(this)
    }
    getClassInstance(Class) {
        return new Class(this.dependencies)
    }
    getSingleton(key, Class) {
        if (!this.singletons.has(key)) {
            const instance = this.getClassInstance(Class)
            this.singletons.set(key, instance)
        }
        return this.singletons.get(key)
    }
    getInstance(key) {
        const { type, value } = this.bindings.getBinding(key)
        switch (type) {
            case bindingTypes.CLASS:
                return  this.getClassInstance(value)
            case bindingTypes.SINGLETON:
                return this.getSingleton(key, value)
            case bindingTypes.VALUE:
                return value
        }
    }
}

module.exports = Container