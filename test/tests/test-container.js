const assert = require('assert').strict

const Bindings = require('../../src/bindings')
const Container = require('../../src/container')
const { NoBindingError } = require('../../src/binding-errors')

let instanceID = 0
const testValue = 'testValue'

class AClass {
    constructor() {
        this.id = instanceID++
    }
}

class BClass {
    constructor( { aclass, value }) {
        this.aclass = aclass
        this.value = value
    }
}

class TestContainer {
    beforeEach() {
        this.bindings = new Bindings()
        this.container = new Container(this.bindings)
    }
    getClassInstance() {
        return () => {
            this.bindings.bind('aclass').toClass(AClass)
            const aclassInstance = this.container.getInstance('aclass')
            assert.ok(aclassInstance instanceof AClass)
        }
    }
    getValue() {
        return () => {
            this.bindings.bind('value').toValue(testValue)
            const actualValue = this.container.getInstance('value')
            assert.deepStrictEqual(actualValue, testValue)
        }
    }
    getSingleton() {
        return () => {
            this.bindings.bind('singleton').toClass(AClass).asSingleton()
            const instance1 = this.container.getInstance('singleton')
            const instance2 = this.container.getInstance('singleton')
            assert.deepStrictEqual(instance1, instance2)
        }
    }
    getClassInstanceWithDependencies() {
        return () => {
            this.bindings.bind('aclass').toClass(AClass)
            this.bindings.bind('bclass').toClass(BClass)
            this.bindings.bind('value').toValue(testValue)
            const bclassInstance = this.container.getInstance('bclass')
            assert.ok(bclassInstance instanceof BClass)
            assert.ok(bclassInstance.aclass instanceof AClass)
            assert.deepStrictEqual(bclassInstance.value, testValue)
        }
    }
    getInstanceFromRootContainer() {
        return () => {
            const child1 = new Container()
            const child2 = new Container()
            this.container.addContainer(child1, child2)
            this.bindings.bind('bclass').toClass(BClass)
            child1.bindings.bind('aclass').toClass(AClass)
            child2.bindings.bind('value').toValue(testValue)
            const bclassInstance = this.container.getInstance('bclass')
            assert.ok(bclassInstance instanceof BClass)
            assert.ok(bclassInstance.aclass instanceof AClass)
            assert.deepStrictEqual(bclassInstance.value, testValue)
        }
    }
    throwsNoContainer() {
        return () => {
            assert.throws(() => this.container.getInstance('nobinding'), NoBindingError)
        }
    }
}

module.exports = TestContainer