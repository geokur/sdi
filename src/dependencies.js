class Dependencies {
    constructor(container) {
        return new Proxy(container, {
            get(target, key) {
                return target.getInstance(key)
            }
        })
    }
}

module.exports = Dependencies