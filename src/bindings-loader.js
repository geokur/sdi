const isClass = require('./is-class')
const Loader = require('./loader')

class BindingsLoader {
	constructor() {
		this.loader = new Loader()
	}
	loadDir(dir, bindings, recursive = true) {
		this.loader.loadDir(dir, recursive)
		this.loader.index.forEach((value, key) => isClass(value) ? bindings.bind(key).toClass(value) : 
																	bindings.bind(key).toValue(value))
	}
}

module.exports = BindingsLoader