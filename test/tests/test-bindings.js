const assert = require('assert').strict

const Bindings = require('../../src/bindings')
const bindingTypes = require('../../src/binding-types')
const { NoBindingError, NoNClassBindingError } = require('../../src/binding-errors')

const testValue = 'testValue'

class AClass {}

class TestBindings {
    classBinding() {
        return () => {
            const bindings = new Bindings()
            bindings.bind('aclass').toClass(AClass)
            const actualBinding = bindings.getBinding('aclass')
            assert.strictEqual(actualBinding.type, bindingTypes.CLASS)
            assert.strictEqual(actualBinding.value, AClass)
        }
    }
    classAsSingletonBinding() {
        return () => {
            const bindings = new Bindings()
            bindings.bind('aclass').toClass(AClass).asSingleton()
            const actualBinding = bindings.getBinding('aclass')
            assert.strictEqual(actualBinding.type, bindingTypes.SINGLETON)
            assert.strictEqual(actualBinding.value, AClass)
        }
    }
    valueBinding() {
        return () => {
            const bindings = new Bindings()
            bindings.bind('value').toValue(testValue)
            const actualBinding = bindings.getBinding('value')
            assert.strictEqual(actualBinding.type, bindingTypes.VALUE)
            assert.strictEqual(actualBinding.value, testValue)
        }
    }
    keyClassBinding() {
        return () => {
            const bindings = new Bindings()
            bindings.bind('aclass').toClass(AClass)
            bindings.bind('bclass').toKey('aclass')
            const actualBinding = bindings.getBinding('bclass')
            assert.strictEqual(actualBinding.type, bindingTypes.CLASS)
            assert.strictEqual(actualBinding.value, AClass)
        }
    }
    keyAsSingletonBinding() {
        return () => {
            const bindings = new Bindings()
            bindings.bind('aclass').toClass(AClass)
            bindings.bind('aclass').asSingleton()
            const actualBinding = bindings.getBinding('aclass')
            assert.strictEqual(actualBinding.type, bindingTypes.SINGLETON)
            assert.strictEqual(actualBinding.value, AClass)
        }
    }
    keyClassAsSingletonBinding() {
        return () => {
            const bindings = new Bindings()
            bindings.bind('aclass').toClass(AClass)
            bindings.bind('bclass').toKey('aclass').asSingleton()
            const initialBinding = bindings.getBinding('aclass')
            const actualBinding = bindings.getBinding('bclass')
            assert.strictEqual(initialBinding.type, bindingTypes.CLASS)
            assert.strictEqual(initialBinding.value, AClass)
            assert.strictEqual(actualBinding.type, bindingTypes.SINGLETON)
            assert.strictEqual(actualBinding.value, AClass)
        }
    }
    throwsNoBinding() {
        return () => {
            const bindings = new Bindings()
            assert.throws(() => bindings.getBinding('aclass'), NoBindingError)
        }
    }
    throwsSingletonToNonClassBinding() {
        return () => {
            const bindings = new Bindings()
            bindings.bind('value').toValue(testValue)
            assert.throws(() => bindings.bind('avalue').toKey('value').asSingleton(), NoNClassBindingError)
        }
    }
    throwsNonClassBinding() {
        return () => {
            const bindings = new Bindings()
            assert.throws(() => bindings.bind('aclass').toClass(testValue), NoNClassBindingError)
        }
    }
}

module.exports = TestBindings