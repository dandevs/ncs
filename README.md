# NCS

## API
* `getComponent( target, id? )` Returns the last instantiated component of target
* `getAllComponents( target, id? )` Returns all components of target with specified id
* `addComponent( target, id? )` Creates and returns a new component of target
* `removeComponent( target : Function | Object, id? )` Removes components. Removes all instances of target if type is a Function, Object removes this specific component 
* `runSystem( target, function_name )` Runs specified function on all specified component
* `runSystemCB( target, callback )` Iterates through every target component, passing  the component itself in to the callback 


## Example

```
import * as NCS from "ncs";
// or var NCS = require( "ncs" );

class One extends NCS.Component
{
    constructor() {
        super();
        // let three = this.addComponent( Three );
        // let two = this.addComponent( Two, [ 123 ] );
    }
    // Or.....
    OnInit() {
        let three = this.addComponent( Three );
        let two = this.addComponent( Two, [ 123 ] );
        
        // Remoevs only this specific Three
        this.removeComponent( three );
        
        // This will remove all Three on this entity
        // this.removeComponent( Three );
    }
}

class Two extends NCS.Component
{
    OnInit( value ) {
        let one = this.getComponent( One );
        let three = this.getComponent( Three );
    }

    foo() {
        console.log( "Foo! from id: " + this.instanceID );
    }
}

class Three 
{
    constructor() {
        console.log( "Three" );
    }
}

new One();

NCS.runSystem( Two, "foo" );
// Or.....
NCS.runSystemCB( Two, two => {
    two.foo();
});
```