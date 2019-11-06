# Simple Dependency Injection Framework
## Background
This DI framework supports only constructor injection. Internally it uses object destructuring.
## Install
```shell
npm install sdif
```
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