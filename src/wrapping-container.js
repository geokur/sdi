const Container = require('./container')

class WrappingContainer extends Container {
    constructor(bindings, wrapper) {
        super(bindings)
        this.wrapper = wrapper
    }
    getInstance(key) {
        const instance = super.getInstance(key)
        return this.wrapper.wrap(instance)
    }
}

module.exports = WrappingContainer