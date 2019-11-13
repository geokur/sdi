# Simple Dependency Injection Framework
## Background
This DI framework supports only constructor injection. Internally it uses object destructuring.
## Install
```shell
npm install sdif
```
# Quick start
All quickstart code is stored in repo: https://github.com/geokur/sdif-examples
## Injection of Class and Value
Let's create class representing a car:
```javascript
class Car {
    constructor({ model, engine, transmission }) {
        this.model = model
        this.engine = engine
        this.transmission = transmission
    }
    get specs() {
        return  this.model + ' specs:\n\t' + 
            this.engine.specs + '\n\t' +
            this.transmission.specs
    }
}
```
This class has 3 dependencies: model, engine and transmission.
Let's create 2 classes: 'Engine' and 'Transmission'. And constant 'model'.
```javascript
class DieselEngine {
    constructor() {
        this.fuel = 'Diesel'
        this.type = 'I'
        this.cylinders = 4
        this.size = 1995
        this.power = 143
    }
    get specs() {
        return `Engine: ${this.fuel} ${this.type}-${this.cylinders} ${this.size} cm3 ${this.power} PS`
    }
}

class AutomaticTransmission {
    constructor() {
        this.type = 'Automatic'
        this.gears = 6
    }
    get specs() {
        return `Transmission: ${this.type} ${this.gears} gear`
    }
}

const bmwModel = 'BMW 118d'
```
Now let's assemble a car instance
```javascript
const { Bindings, Container } = require('sdif')

const bindings = new Bindings()

bindings.bindClass(Car) // shortcut for bindings.bind('car').toClass(Car)
bindings.bind('model').toValue(bmwModel)
bindings.bind('engine').toClass(DieselEngine)
bindings.bind('transmission').toClass(AutomaticTransmission)

const container = new Container(bindings)

const bmw118 = container.getInstance('car')
```
Try to log to console the car's specs
```shell
console.log(bmw118.specs)
```
Expected output will be:
```
BMW 118d specs:
	Engine: Diesel I-4 1995 cm3 143 PS
	Transmission: Automatic 6 gear
```
## Key to key binding
You can bind another key to existing binding. The example above can be changed so we bind all classes and afterwords bind keys `engine` and `transmission` to keys already bound to specific classes.
```javascript
// ...

// ...

// Bind all classes
bindings.bindClass(Car, DieselEngine, AutomaticTransmission)

// Bind `engine` and `transmission` keys to keys bound to classes
bindings.bind('engine').toKey('dieselEngine')
bindings.bind('transmission').toKey('automaticTransmission')

// ...
```
## Singleton binding
```javascript
const { Bindings, Container } = require('sdif')

class InMemoryLogger {
    constructor() {
        this.rows = []
    }
    log(row) {
        this.rows.push(row)
    }
    printLog() {
        this.rows.forEach(row => console.log(row))
    }
}

class CheckoutService {
    constructor({ logger, orderService }) {
        this.logger = logger
        this.orderService = orderService
    }
    checkout(purchase) {
        this.logger.log(`Checkout purchase: ${purchase}`)
        this.orderService.createOrder(purchase)
    }
}

class OrderService {
    constructor({ logger }) {
        this.logger = logger
    }
    createOrder(purchase) {
        this.logger.log(`Create order for: ${purchase}`)
    }
}

const bindings = new Bindings()
bindings.bindClass(CheckoutService, OrderService)
// Bind Logger as Singleton to share its instance
bindings.bind('logger').toClass(InMemoryLogger).asSingleton()

const container = new Container(bindings)

const logger = container.getInstance('logger')
const checkoutService = container.getInstance('checkoutService')

checkoutService.checkout('iPhone 11')

logger.printLog()
```
Expected output:
```
Checkout purchase: iPhone 11
Create order for: iPhone 11
```
## Getting instance through destructuring
Above example can be changed to use Dependencies class. This will allow getting of instances through destructuring where property names are keys we used in bindings:
```javascript
const { Bindings, Container, Dependencies } = require('sdif')
// ...

// ...
/* Change getting instance from:

const logger = container.getInstance('logger')
const checkoutService = container.getInstance('checkoutService')

to destructuring:
*/

const dependencies = new Dependencies(container)
const { logger, checkoutService } = dependencies

//...
```
## Bindings loading
There is a way to automate binding by usage of BindingsLoader class. It will recursevely require files and create bindings.
Lets assume all classes from example above are placed in separate files in folder 'loaded'. Then bindings loading will look like this:
```javascript
const path = require('path')
const { Bindings, Container, Dependencies, BindingsLoader } = require('sdif')

const loadedPath = path.join(__dirname, 'loaded')
const bindings = new Bindings()

// Load bindings
BindingsLoader.loadDir(loadedPath, bindings)

/* After this command bindings will be the same as we would
manually require all classes from files and bind using:
    bindings.bindClass(CheckoutService, OrderService, InMemoryLogger)
*/

// The only binding which needs to be set manually to bind Logger to existing binding 
// and specify that it should be singleton 
bindings.bind('logger').toKey('inmemoryLogger').asSingleton()

// ...
```