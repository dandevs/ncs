let init_string = "OnInit";

class Entity implements IEntity
{
    public static instances : IEntity[] = [];
    public static counter : number = 0;
    public static pass : IEntity;
}

export abstract class Component
{
    private __id : number;
    private static _map : any[] = [];
    public static get map() : any[] { return this._map; }

    /**
     * Returns this components ID
     */
    public get instanceID() : number {
        return this.__id;
    }

    public constructor()
    {
        let entity : IEntity = Entity.pass;

        if ( !entity ) 
            entity = { root : this, id : Entity.counter++ }

        this.__id = entity.id;
        Entity.instances[ entity.id ] = entity;

        // Construct field for this name
        let indexName : any = this.constructor;

        if ( !Component._map[ indexName ] )
            Component._map[ indexName ] = []

        if ( !Component._map[ indexName ][ entity.id ] )
            Component._map[ indexName ][ entity.id ] = [];

        Component._map[ indexName ][ entity.id ].push( this )

        let args = entity.args || [];
        Entity.pass = undefined;
        initialize( this, args );  
    }

    /**
     * Returns the requested component if it exists
     * @param {Function} The component to return
     */
    public getComponent( target : Function, id : number = this.__id ) : any
    {
        return getComponent( target, id );
    }

    public getAllComponents( target : Function, id : number = this.__id ) : any[]
    {
        return getAllComponents( target, id );
    }

    /**
     * Creates and returns a new component
     * @param {Function} The component type to create
     */
    public addComponent( target : Function, ...args : any[] ) : any
    {
        let entity : IEntity = getEntityByID( this.__id );
        Entity.pass = entity;
        Entity.pass.args = args;

        let t:      any         = target;
        let object: Component   = new t( ...args );
        let isECS:  boolean     =  object.instanceID ? true : false; 

        Entity.pass = undefined;

        if ( !isECS )
        {
            let indexName = t;

            if ( !Component._map[ indexName ] )
                Component._map[ indexName ] = []

            if ( !Component._map[ indexName ][ entity.id ] )
                Component._map[ indexName ][ entity.id ] = [];

            Component._map[ indexName ][ entity.id ].push( object )
        }

        return object;
    }
}

/**
 * Runs a specified function for all instances of a component via callback
 * @param {Function} Target component
 * @param {function} the callback with a parameter to pass the component 
 */
export function runSystemCB( target : Function, callback : ( object : any ) => void )
{
    let t : any = target;
    let components = Component.map[ t ];
    
    for ( let i in components ) 
        for ( let j in components[ i ] )
            callback( components[ i ][ j ] );
}

/**
 * Runs a specified for all instances of a specific component
 * @param {Function} Target component
 * @param {string} The name of the function to runSystem
 * @param {...} Any arguements to pass in to that function
 */
export function runSystem( target : Function, func : string, ...args : any[] )
{
    let t : any = target;
    let components = Component.map[ t ];
    
    for ( let i in components ) 
        for ( let j in components[ i ] )
            components[ i ][ j ][ func ]( ...args );
}

/**
 * Retrieve an ID by an ID
 * @param {id} the ID of the entity to retriev
 */
export function getEntityByID( id : number ) // Possibly redundant
{
    return Entity.instances[ id ];
}

/**
 * Get a component by a type from an ID
 * @param {Function} The type to retrieve
 * @param {number} the ID to retrieve from
 */
export function getComponent( target : Function, id : number ) : any
{
    let t : any = target;
    return Component.map[ t ][ id ][ 0 ];
}

export function getAllComponents( target : Function, id : number ) : any[]
{
    let t : any = target;
    return Component.map[ t ][ id ];
}

/**
 * Runs OnInit() on the target object
 * @param {Object} the object to initialize
 */
function initialize( target : Object, args : any[] )
{
    if ( target[ init_string ] ) 
        target[ init_string ]( ...args );
}

interface IEntity
{
    root?:      Object;
    id?:        number;
    args?:      any;
}
