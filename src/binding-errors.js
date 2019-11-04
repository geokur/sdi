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

class NoContainerError extends Error {
    constructor(key) {
        super(`No container for key: ${key}`)
    }
}

module.exports = { NoBindingError, NoNClassBindingError, NoContainerError }