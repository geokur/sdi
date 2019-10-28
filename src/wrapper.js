const { isPromise } = require('util').types

class MethodHandler {
    constructor(wrapper) {
        this.wrapper = wrapper
    }
    apply(target, thisArg, args) {
        this.wrapper.before({ target, thisArg, args })
        try {
            const result = Reflect.apply(target, thisArg, args)
            if (isPromise(result)) {
                result.then(
                    value => this.wrapper.afterReturn({ target, thisArg, args }, value),
                    error => {
                        this.wrapper.afterThrow({ target, thisArg, args }, error)
                        throw error
                    }
                )
            } else {
                this.wrapper.afterReturn({ target, thisArg, args }, result)
            }
            return result
        } catch(error) {
            this.wrapper.afterThrow({ target, thisArg, args }, error)
            throw error
        }
    }
}

class ObjectHandler {
    constructor(wrapper) {
        this.wrapper = wrapper
        this.methodHandler = new MethodHandler(this.wrapper)
    }
    get(target, key) {
        const property = target[key]
        if (typeof property === 'function') {
            return new Proxy(property, this.methodHandler)
        }
        return property
    }
}

const alwaysTrue = () => true

class Wrapper {
    constructor(container, wrapperFactory, predicate = alwaysTrue) {
        this.container = container
        this.predicate = predicate
        this.wrapperFactory = wrapperFactory
    }
    static wrap(instance, objectWrapper) {
        const objectHandler = new ObjectHandler(objectWrapper)
        return new Proxy(instance, objectHandler)
    }
    wrapInstance(instance) {
        const objectWrapper = this.wrapperFactory()
        return Wrapper.wrap(instance, objectWrapper)
    }
    getInstance(key) {
        const instance = this.container.getInstance(key)
        if (this.predicate(key, instance)) {
            return this.wrapInstance(instance)
        }
        return instance
    }
}

module.exports = Wrapper