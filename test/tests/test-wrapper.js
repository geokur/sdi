const assert = require('assert').strict

const Bindings = require('../../src/bindings')
const Container = require('../../src/container')
const Wrapper = require('../../src/wrapper')

const param = 'methodParam'

class ClassToWrap {
    methodReturns(arg) {
        return arg
    }
    methodThrows(error) {
        throw error
    }
}

class DirectClass {
    methodReturns(arg) {
        return arg
    }
    methodThrows(error) {
        throw error
    }
}

class ObjectWrapper {
    before({ target, args }) {
        this.beforeMethod = { target, args }
    }
    afterReturn({ target, args }, result) {
        this.afterMethodReturn = { target, args, result }
    }
    afterThrow({ target, args }, error) {
        this.afterMethodThrow = { target, args, error }
    }
}

class TestWrapper {
    beforeEach() {
        this.bindings = new Bindings()
        this.bindings.bind('classToWrap').toClass(ClassToWrap)
        this.container = new Container(this.bindings)
        this.objectWrapper = new ObjectWrapper()
        const wrapperFactory = () => this.objectWrapper
        const wrapper = new Wrapper(this.container, wrapperFactory)
        this.wrapped = wrapper.getInstance('classToWrap')
    }
    beforeMethod() {
        return () => {
            const actualReturn = this.wrapped.methodReturns(param)
            const { beforeMethod } = this.objectWrapper
            assert.strictEqual(actualReturn, param)
            assert.strictEqual(beforeMethod.target.name, 'methodReturns')
            assert.strictEqual(beforeMethod.args.length, 1)
            assert.strictEqual(beforeMethod.args[0], param)
        }
    }
    methodRetuns() {
        return () => {
            const actualReturn = this.wrapped.methodReturns(param)
            const { afterMethodReturn } = this.objectWrapper
            assert.strictEqual(actualReturn, param)
            assert.strictEqual(afterMethodReturn.target.name, 'methodReturns')
            assert.strictEqual(afterMethodReturn.args.length, 1)
            assert.strictEqual(afterMethodReturn.args[0], param)
            assert.strictEqual(afterMethodReturn.result, param)
        }
    }
    methodThrows() {
        return () => {
            const error = new Error('ERROR')
            assert.throws(() => this.wrapped.methodThrows(error), error)
            const { afterMethodThrow } = this.objectWrapper
            assert.strictEqual(afterMethodThrow.target.name, 'methodThrows')
            assert.strictEqual(afterMethodThrow.args.length, 1)
            assert.strictEqual(afterMethodThrow.args[0], error)
            assert.strictEqual(afterMethodThrow.error, error)
        }
    }
    predicate() {
        return () => {
            this.bindings.bind('directClass').toClass(DirectClass)
            const wrapperFactory = () => this.objectWrapper
            const isWrappable = (key) => key.includes('ToWrap')
            const wrapper = new Wrapper(this.container, wrapperFactory, isWrappable)
            const direct = wrapper.getInstance('directClass')
            const actualReturn = direct.methodReturns(param)
            assert.strictEqual(actualReturn, param)
            assert.strictEqual(this.objectWrapper.afterMethodReturn, undefined)
        }
    }
}

module.exports = TestWrapper