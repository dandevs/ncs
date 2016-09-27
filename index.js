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
            entity = { root: this, id: Entity.counter++, refs: [] };
        this.__id = entity.id;
        Entity.instances[entity.id] = entity;
        // Construct field for this name
        var indexName = functionName(this.constructor);
        if (!Component._map[indexName])
            Component._map[indexName] = [];
        if (!Component._map[indexName][entity.id])
            Component._map[indexName][entity.id] = [];
        entity.refs.push(this);
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
    Component.prototype.removeComponent = function (target, id) {
        if (id === void 0) { id = this.__id; }
        removeComponent(target, id);
    };
    Component.prototype.destroyEntity = function (id) {
        if (id === void 0) { id = this.__id; }
        destroyEntity(id);
    };
    /**
     * Creates and returns a new component
     * @param {Function} The component type to create
     */
    Component.prototype.addComponent = function (target, args) {
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
function runSystem(target, func, args) {
    var t = target;
    var components = Component.map[t];
    for (var i in components)
        for (var j in components[i])
            (_a = components[i][j])[func].apply(_a, args);
    var _a;
}
exports.runSystem = runSystem;
function destroyEntity(id) {
    var components = getEntityByID(id).refs;
    for (var _i = 0, components_1 = components; _i < components_1.length; _i++) {
        var component = components_1[_i];
        component.removeComponent(component);
    }
}
exports.destroyEntity = destroyEntity;
/**
 * Retrieve an ID by an ID
 * @param {id} the ID of the entity to retriev
 */
function getEntityByID(id) {
    return Entity.instances[id];
}
exports.getEntityByID = getEntityByID;
/**
 * Get a component by a type from an ID, returns the latest one created
 * @param {Function} The type to retrieve
 * @param {number} the ID to retrieve from
 */
function getComponent(target, id) {
    var t = target;
    if (!Component.map[t]) {
        console.log("NCS: No components of '" + functionName(target) + "' exist");
        return;
    }
    var l = Component.map[t][id].length - 1;
    return Component.map[t][id][l];
}
exports.getComponent = getComponent;
/**
 * Returns an array of all components of target
 * @param {Function} The type to retrieve
 * @param {number} the ID to retrieve from
 */
function getAllComponents(target, id) {
    var t = target;
    if (!Component.map[t]) {
        console.log("NCS: No components of '" + functionName(target) + "' exist");
        return;
    }
    return Component.map[t][id];
}
exports.getAllComponents = getAllComponents;
function removeComponent(target, id) {
    var t = target;
    if (typeof (target) == "function")
        console.log(Component.map[t][id] = []);
    else {
        var index = Component.map[t.constructor][id].indexOf(target);
        if (index > -1)
            Component.map[t.constructor][id].splice(index, 1);
    }
}
exports.removeComponent = removeComponent;
/**
 * Runs OnInit() on the target object
 * @param {Object} the object to initialize
 */
function initialize(target, args) {
    if (target[init_string])
        target[init_string].apply(target, args);
}
function functionName(fun) {
    var ret = fun.toString();
    ret = ret.substr("function ".length);
    ret = ret.substr(0, ret.indexOf("("));
    return ret;
}
