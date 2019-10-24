const path = require('path')
const assert = require('assert').strict

const Loader = require('../../src/loader')

const SomeClass = require('../loaded/some-class')
const pojo = require('../loaded/pojo')
const fun = require('../loaded/fun')

class TestLoader {
    beforeEach() {
        this.loader = new Loader()
        const loadedPath = path.resolve(path.join(__dirname, '../loaded'))
        this.loader.loadDir(loadedPath)
    }
    classLoading() {
        return () => {
            const loadedClass = this.loader.get('someClass')
            assert.strictEqual(loadedClass, SomeClass)
        }
    }
    functionLoading() {
        return () => {
            const loadedFunc = this.loader.get('someFun')
            assert.strictEqual(typeof loadedFunc, 'function')
            assert.strictEqual(loadedFunc, pojo.someFun)
        }
    }
    exportedFunctionLoading() {
        return () => {
            const loadedFunc = this.loader.get('loadedFun')
            assert.strictEqual(typeof loadedFunc, 'function')
            assert.strictEqual(loadedFunc, fun)
        }
    }
    objectLoading() {
        return () => {
            const loadedObj = this.loader.get('someObj')
            assert.strictEqual(typeof loadedObj, 'object')
            assert.strictEqual(loadedObj, pojo.someObj)
        }
    }
    constantLoading() {
        return () => {
            const loadedConst = this.loader.get('someValue')
            assert.strictEqual(loadedConst, 'someValue')
        }
    }
}

module.exports = TestLoader