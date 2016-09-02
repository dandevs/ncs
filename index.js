"use strict";
var init_string = "OnInit";
var Entity = (function () {
    function Entity() {
    }
    Entity.instances = [];
    Entity.counter = 0;
    return Entity;
}());
var Component = (function () {
    function Component() {
        var entity = Entity.pass;
        if (!entity)
            entity = { root: this, id: Entity.counter++ };
        this.__id = entity.id;
        Entity.instances[entity.id] = entity;
        // Construct field for this name
        var indexName = this.constructor;
        if (!Component._map[indexName])
            Component._map[indexName] = [];
        if (!Component._map[indexName][entity.id])
            Component._map[indexName][entity.id] = [];
        Component._map[indexName][entity.id].push(this);
        var args = [];
        for (var idx in arguments)
            args[idx] = arguments[idx];
        Entity.pass = undefined;
        initialize(this, args);
    }
    Object.defineProperty(Component.prototype, "instanceID", {
        get: function () { return this.__id; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component, "map", {
        get: function () { return this._map; },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the requested component if it exists
     * @param {Function} The component to return
     */
    Component.prototype.getComponent = function (target, id) {
        if (id === void 0) { id = this.__id; }
        return getComponent(target, id);
    };
    Component.prototype.getAllComponents = function (target, id) {
        if (id === void 0) { id = this.__id; }
        return getAllComponents(target, id);
    };
    /**
     * Creates and returns a new component
     * @param {Function} The component type to create
     */
    Component.prototype.addComponent = function (target) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var entity = getEntityByID(this.__id);
        Entity.pass = entity;
        var t = target;
        var object = new (t.bind.apply(t, [void 0].concat(args)))();
        var isECS = object.instanceID != undefined ? true : false;
        Entity.pass = undefined;
        if (!isECS) {
            var indexName = t;
            if (!Component._map[indexName])
                Component._map[indexName] = [];
            if (!Component._map[indexName][entity.id])
                Component._map[indexName][entity.id] = [];
            Component._map[indexName][entity.id].push(object);
        }
        return object;
    };
    Component._map = [];
    return Component;
}());
exports.Component = Component;
/**
 * Runs a specified function for all instances of a component via callback
 * @param {Function} Target component
 * @param {function} the callback with a parameter to pass the component
 */
function runSystemCB(target, callback) {
    var t = target;
    var components = Component.map[t];
    for (var i in components)
        for (var j in components[i])
            callback(components[i][j]);
}
exports.runSystemCB = runSystemCB;
/**
 * Runs a specified for all instances of a specific component
 * @param {Function} Target component
 * @param {string} The name of the function to runSystem
 * @param {...} Any arguements to pass in to that function
 */
function runSystem(target, func) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var t = target;
    var components = Component.map[t];
    for (var i in components)
        for (var j in components[i])
            (_a = components[i][j])[func].apply(_a, args);
    var _a;
}
exports.runSystem = runSystem;
/**
 * Retrieve an ID by an ID
 * @param {id} the ID of the entity to retriev
 */
function getEntityByID(id) {
    return Entity.instances[id];
}
exports.getEntityByID = getEntityByID;
/**
 * Get a component by a type from an ID
 * @param {Function} The type to retrieve
 * @param {number} the ID to retrieve from
 */
function getComponent(target, id) {
    var t = target;
    return Component.map[t][id][0];
}
exports.getComponent = getComponent;
function getAllComponents(target, id) {
    var t = target;
    return Component.map[t][id];
}
exports.getAllComponents = getAllComponents;
/**
 * Runs OnInit() on the target object
 * @param {Object} the object to initialize
 */
function initialize(target, args) {
    if (target[init_string])
        target[init_string].apply(target, args);
}
