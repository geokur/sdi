const fs = require("fs")
const path = require('path')
const isClass = require('./is-class')

class Loader {
	constructor() {
		this.index = new Map()
	}
	get(key) {
		return this.index.get(key.toUpperCase())
	}
	register(loaded) {
		if (isClass(loaded)) {
			const key = loaded.name.toUpperCase()
			this.index.set(key, loaded)
		} else if (typeof loaded === 'object') {
			Object.keys(loaded).forEach(key => this.index.set(key.toUpperCase(), loaded[key]))
		} else if (typeof loaded === 'function') {
			this.index.set(loaded.name.toUpperCase(), loaded)
		}
	}
	loadFile(file) {
		const loaded = require(file)
		this.register(loaded)
	}
	loadDir(dir, recursive = true) {
		fs.readdirSync(dir).forEach(file => {
			const filePath = path.join(dir, file)
			if (fs.statSync(filePath).isDirectory() && recursive) {
				this.loadDir(filePath)
			} else {
				this.loadFile(filePath)
			}
		})
	}
}

module.exports = Loader
