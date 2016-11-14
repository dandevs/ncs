declare module 'ncs' {
	export abstract class Component {
	    private __id;
	    readonly instanceID: number;
	    private static _map;
	    static readonly map: any[];
	    constructor();
	    /**
	     * Returns the requested component if it exists
	     * @param {Function} The component to return
	     */
	    getComponent(target: Function, id?: number): any;
	    getAllComponents(target: Function, id?: number): any[];
	    removeComponent(target: Function | Object, id?: number): void;
	    destroyEntity(id?: number): void;
	    /**
	     * Creates and returns a new component
	     * @param {Function} The component type to create
	     */
	    addComponent(target: Function, args?: any[]): any;
	}
	/**
	 * Runs a specified function for all instances of a component via callback
	 * @param {Function} Target component
	 * @param {function} the callback with a parameter to pass the component
	 */
	export function runSystemCB(target: Function, callback: (object: any) => void): void;
	/**
	 * Runs a specified for all instances of a specific component
	 * @param {Function} Target component
	 * @param {string} The name of the function to runSystem
	 * @param {...} Any arguements to pass in to that function
	 */
	export function runSystem(target: Function, func: string, args?: any[]): void;
	export function destroyEntity(id: number): void;
	/**
	 * Retrieve an ID by an ID
	 * @param {id} the ID of the entity to retriev
	 */
	export function getEntityByID(id: number): IEntity;
	/**
	 * Get a component by a type from an ID, returns the latest one created
	 * @param {Function} The type to retrieve
	 * @param {number} the ID to retrieve from
	 */
	export function getComponent(target: Function, id: number): any;
	/**
	 * Returns an array of all components of target
	 * @param {Function} The type to retrieve
	 * @param {number} the ID to retrieve from
	 */
	export function getAllComponents(target: Function, id: number): any[];
	export function removeComponent(target: Function | Object, id: number): void;
	export interface IEntity {
	    root?: Object;
	    id?: number;
	    args?: any;
	    refs?: any[];
	}

}
