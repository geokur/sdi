class NoBindingError extends Error {
    constructor(key) {
        super(`No binding for key: ${key}`)
    }
}

class NoNClassBindingError extends Error {
    constructor(value) {
        super(`Value is not class: ${typeof value}`)
    }
}

module.exports = { NoBindingError, NoNClassBindingError }