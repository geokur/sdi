const isClass = require('./is-class')
const Loader = require('./loader')

class BindingsLoader {
	static loadDir(dir, bindings, recursive = true) {
		const loader = new Loader()
		loader.loadDir(dir, recursive)
		loader.index.forEach((value, key) => isClass(value) ? bindings.bind(key).toClass(value) : 
																	bindings.bind(key).toValue(value))
	}
}

module.exports = BindingsLoader