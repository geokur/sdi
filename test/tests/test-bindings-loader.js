const path = require('path')
const assert = require('assert').strict

const SomeClass = require('../loaded/some-class')
const BindingsLoader = require('../../src/bindings-loader')
const Bindings = require('../../src/bindings')
const bindingTypes = require('../../src/binding-types')

class TestBindingsLoader {
    beforeEach() {
        this.bindings = new Bindings()
        const loadedPath = path.resolve(path.join(__dirname, '../loaded'))
        BindingsLoader.loadDir(loadedPath, this.bindings)
    }
    classLoading() {
        return () => {
            const actualBinding = this.bindings.getBinding('someclass')
            assert.strictEqual(actualBinding.type, bindingTypes.CLASS)
            assert.strictEqual(actualBinding.value, SomeClass)
        }
    }
    functionLoading() {
        return () => {
            const actualBinding = this.bindings.getBinding('someFun')
            assert.strictEqual(actualBinding.type, bindingTypes.VALUE)
            assert.strictEqual(typeof actualBinding.value, 'function')
        }
    }
    exportedFunctionLoading() {
        return () => {
            const actualBinding = this.bindings.getBinding('loadedFun')
            assert.strictEqual(actualBinding.type, bindingTypes.VALUE)
            assert.strictEqual(typeof actualBinding.value, 'function')
        }
    }
    objectLoading() {
        return () => {
            const actualBinding = this.bindings.getBinding('someObj')
            assert.strictEqual(actualBinding.type, bindingTypes.VALUE)
            assert.strictEqual(typeof actualBinding.value, 'object')
        }
    }
    constantLoading() {
        return () => {
            const actualBinding = this.bindings.getBinding('someValue')
            assert.strictEqual(actualBinding.type, bindingTypes.VALUE)
            assert.strictEqual(actualBinding.value, 'someValue')
        }
    }
}

module.exports = TestBindingsLoader