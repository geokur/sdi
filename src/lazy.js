class Lazy {
	constructor(Cls) {
		return class {
			constructor(...args) {
				let inst = null
				return new Proxy(Cls, {
					get(target, key) {
						inst = inst || new Cls(...args)
						return inst[key]
					}
				})
			}
		}
	}
}

module.exports = Lazy