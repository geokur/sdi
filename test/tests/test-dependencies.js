const assert = require('assert').strict

const Bindings = require('../../src/bindings')
const Container = require('../../src/container')
const Dependecies = require('../../src/dependencies')

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
class TestDependencies {
    beforeEach() {
        this.bindings = new Bindings()
        this.container = new Container(this.bindings)
        this.dependencies = new Dependecies(this.container)
    }
    classInstance() {
        return () => {
            this.bindings.bind('aclass').toClass(AClass)
            const { aclass } = this.dependencies
            assert.ok(aclass instanceof AClass)
        }
    }
    value() {
        return () => {
            this.bindings.bind('value').toValue(testValue)
            const { value } = this.dependencies
            assert.deepStrictEqual(value, testValue)
        }
    }
    singleton() {
        return () => {
            this.bindings.bind('singleton').toClass(AClass).asSingleton()
            const { singleton: instance1 } = this.dependencies
            const { singleton: instance2 } = this.dependencies
            assert.deepStrictEqual(instance1, instance2)
        }
    }
    withDependencies() {
        return () => {
            this.bindings.bind('value').toValue(testValue)
            this.bindings.bind('aclass').toClass(AClass)
            this.bindings.bind('bclass').toClass(BClass)
            const { bclass } = this.dependencies
            assert.ok(bclass instanceof BClass)
            assert.ok(bclass.aclass instanceof AClass)
            assert.deepStrictEqual(bclass.value, testValue)
        }
    }
}

module.exports = TestDependencies