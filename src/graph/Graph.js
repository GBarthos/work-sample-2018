const { isFunction, isPlainObject, isString, setPrivateProperty } = require('../tools/utils.js');
const { GraphError, makeInvalidArgumentError, makeKeyUnknownError } = require('./errors.js');

function incrementalId() {
    let i = 0;
    return () => `edgeId(${++i})`;
}

class Node {
    constructor(key, attributes) {
        this.key = key;
        this.attributes = attributes || {};
        // this.edges = {};
        this.out = {};
        this.in = {};
    }
}

class Edge {
    constructor(key, from, to, attributes) {
        this.key = key;
        this.attributes = attributes || {};
        this.from = from || null;
        this.to = to || null;
    }
}

class Graph {
    constructor() {
        setPrivateProperty(this, '_nodes', new Map());
        setPrivateProperty(this, '_edges', new Map());
        setPrivateProperty(this, '_edgeKeyGenerator', incrementalId());
    }

    get order() {
        return this._nodes.size;
    }

    get size() {
        return this._edges.size;
    }

    isEmpty() {
        return !this._nodes.size && !this._edges.size;
    }


    hasNode(node) {
        if (!node || !isString(node)) {
            throw makeInvalidArgumentError('Graph#hasNode', 'node', node);
        }

        return this._nodes.has(node);
    }

    addNode(node, attributes) {
        const _node = isString(node) ? node : null;
        const _attributes = isPlainObject(attributes) ? attributes : {};

        if (!_node) { throw makeInvalidArgumentError('Graph#addNode', 'node', _node); }
        if (this.hasNode(node)) { throw new GraphError(`"Graph#addNode" node {${_node}} already exists.`); }

        const data = new Node(node, _attributes);
        this._nodes.set(node, data);

        return node;
    }

    getNode(node) {
        const _node = isString(node) ? node : null;

        if (!_node) { throw makeInvalidArgumentError('Graph#getNode', 'node', _node); }
        if (!this.hasNode(_node)) { throw makeKeyUnknownError('Graph#getNode', 'node', _node); }

        // const { key, out: edges, attributes } = this._nodes.get(_node);
        // const result = [key, edges, {...attributes}];
        result = this._nodes.get(_node);
        return result;
    }

    *getNodes() {
        for (const { key, out: edges, attributes } of this._nodes.values()) {
            // const ins = Object.keys(edgesIn) || [];
            // const outs = Object.keys(edges) || [];
            const result = [key, edges, {...attributes}];
            yield result;
        }
    }

    forEachNodes(callback) {
        const _callback = isFunction(callback) ? callback : null;

        if (!_callback) { throw makeInvalidArgumentError('Graph#forEachNodes', 'callback', _callback, 'function'); }

        for (const data of this._nodes) {
            const ins = Object.keys(data.in) || [];
            const outs = Object.keys(data.out) || [];
            callback(data.key, ins, outs, {...data.attributes});
        }
    }

    forEachNodeIds(ids, callback) {
        const _ids = Array.isArray(ids) ? ids : null;
        const _callback = isFunction(callback) ? callback : null;

        if (!ids || !_ids.every(isString)) { throw makeInvalidArgumentError('Graph#forEachNodeIds', 'ids', _ids, 'array of strings'); }
        if (!_callback) { throw makeInvalidArgumentError('Graph#forEachNodeIds', 'callback', _callback, 'function'); }

        for (id of _ids) {
            const data = this._nodes.get(id);
            const ins = Object.keys(data.in) || [];
            const outs = Object.keys(data.out) || [];
            callback(data.key, ins, outs, {...data.attributes});
        }
    }

    forNode(node, callback) {
        const _node = isString(node) ? node : null;
        const _callback = isFunction(callback) ? callback : null;

        if (!_node) { throw makeInvalidArgumentError('Graph#forNode', 'node', _node); }
        if (!_callback) { throw makeInvalidArgumentError('Graph#forNode', 'callback', _callback, 'function'); }
        if (!this.hasNode(_node)) { throw makeKeyUnknownError('Graph#forNode', 'node', _node); }

        const data = this._nodes.get(_node);
        const ins = Object.keys(data.in) || [];
        const outs = Object.keys(data.out) || [];
        callback(data.key, ins, outs, {...data.attributes});
    }

    getNodeAttribute(node, name) {
        const _node = isString(node) ? node : null;
        const _name = isString(name) ? name : null;

        if (!_node) { throw makeInvalidArgumentError('Graph#getNodeAttribute', 'node', _node); }
        if (!_name) { throw makeInvalidArgumentError('Graph#getNodeAttribute', 'name', _name); }
        if (!this.hasNode(_node)) { throw makeKeyUnknownError('Graph#getNodeAttribute', 'node', _node); }

        const data = this._nodes.get(_node);
        return data.attributes[_name];
    }

    getNodeAttributes(node) {
        const _node = isString(node) ? node : null;

        if (!_node) { throw makeInvalidArgumentError('Graph#getNodeAttributes', 'node', _node); }
        if (!this.hasNode(_node)) { throw makeKeyUnknownError('Graph#getNodeAttributes', 'node', _node); }

        const data = this._nodes.get(_node);
        return data.attributes;
    }

    updateNodeAttribute(node, name, updater) {
        const _node = isString(node) ? node : null;
        const _name = isString(name) ? name : null;
        const _updater = isFunction(updater) ? updater : null;

        if (!_node) { throw makeInvalidArgumentError('Graph#updateNodeAttribute', 'node', _node); }
        if (!_name) { throw makeInvalidArgumentError('Graph#updateNodeAttribute', 'name',  _name); }
        if (!_updater) { throw makeInvalidArgumentError('Graph#updateNodeAttribute', 'updater', _updater, 'function'); }
        if (!this.hasNode(_node)) { throw makeKeyUnknownError('Graph#updateNodeAttribute', 'node', _node); }

        const data = this._nodes.get(_node);
        data.attributes[_name] = _updater(data.attributes[_name]);
    }

    setNodeAttribute(node, name, value) {
        const _node = isString(node) ? node : null;
        const _name = isString(name) ? name : null;

        if (!_node) { throw makeInvalidArgumentError('Graph#setNodeAttribute', 'node', _node); }
        if (!_name) { throw makeInvalidArgumentError('Graph#setNodeAttribute', 'name', _name); }
        if (!this.hasNode(_node)) { throw makeKeyUnknownError('Graph#setNodeAttribute', 'node', _node); }

        const data = this._nodes.get(_node);
        data.attributes[_name] = value;
    }

    setNodeAttributes(node, attributes) {
        const _node = isString(node) ? node : null;

        if (!_node) { throw makeInvalidArgumentError('Graph#setNodeAttributes', 'node', _node); }
        if (!isPlainObject(attributes)) { throw makeInvalidArgumentError('Graph#setNodeAttributes', 'attributes', attributes, 'plain object'); }
        if (!this.hasNode(_node)) { throw makeKeyUnknownError('Graph#setNodeAttributes', 'node', _node); }

        const data = this._nodes.get(_node);
        data.attributes = attributes;
    }

    hasEdge(edge) {
        if (!edge || !isString(edge)) {
            throw makeInvalidArgumentError('Graph#hasEdge', 'edge', edge);
        }

        return this._edges.has(edge);
    }

    addEdge(from, to, attributes) {
        const _from = isString(from) ? from : null;
        const _to = isString(to) ? to : null;
        const _attributes = isPlainObject(attributes) ? attributes : {};

        if (!_from) { throw makeInvalidArgumentError('Graph#addEdge', 'from', _from); }
        if (!_to) { throw makeInvalidArgumentError('Graph#addEdge', 'to', _to); }

        if (!this.hasNode(_from)) { throw makeKeyUnknownError('Graph#addEdge', 'node', _from); }
        if (!this.hasNode(_to)) { throw makeKeyUnknownError('Graph#addEdge', 'node', _to); }

        const sourceNode = this._nodes.get(_from);
        const targetNode = this._nodes.get(_to);

        // avoid self-looping
        if (sourceNode === targetNode) { throw new GraphError('"Graph#addEdge" can not link a node to itself'); }

        // const edge = `${from}->${to}`; // edge key
        const edge = this._edgeKeyGenerator(); // edge key
        // if (this.hasEdge(edge)) { throw new new KeyConflictGraphError(`"Graph#addEdge" edge`, edge); }

        const data = new Edge(edge, _from, _to, _attributes);
        this._edges.set(edge, data);

        const edgeSet = sourceNode.out[_to] || new Set();
        edgeSet.add(data);

        if (!sourceNode.out[_to]) {
            sourceNode.out[_to] = edgeSet;
        }
        if (!targetNode.in[_from]) {
            targetNode.in[_from] = edgeSet;
        }

        return edge;
    }

    forEachEdges(callback) {
        const _callback = isFunction(callback) ? callback : null;

        if (!_callback) { throw makeInvalidArgumentError('Graph#forEachEdges', 'callback', _callback, 'function'); }

        for (const data of this._edges) {
            if (data.from != _from) { continue; }
            if (data.to != _to) { continue; }

            callback(data.key, data.from, data.to, {...data.attributes});
        }
    }

    forEdge(edge, callback) {
        const _edge = isString(edge) ? edge : null;
        const _callback = isFunction(callback) ? callback : null;

        if (!_edge) { throw makeInvalidArgumentError('Graph#forNode', 'edge', _edge); }
        if (!_callback) { throw makeInvalidArgumentError('Graph#forNode', 'callback', _callback, 'function'); }
        if (!this.hasEdge(_edge)) { throw makeKeyUnknownError('Graph#forNode', 'edge', _edge); }

        const data = this._edges.get(_edge);
        callback(data.key, data.from, data.to, {...data.attributes});
    }

    forEachEdgesBySource(from, callback) {
        const _from = isString(from) ? from : null;
        const _callback = isFunction(callback) ? callback : null;

        if (!_from) { throw makeInvalidArgumentError('Graph#forEachEdgesBySource', 'from', _from); }
        if (!_callback) { throw makeInvalidArgumentError('Graph#forEachEdgesBySource', 'callback', _callback, 'function'); }

        for (const data of this._edges) {
            if (data.from != _from) { continue; }

            callback(data.key, data.from, data.to, {...data.attributes});
        }
    }

    forEachEdgesByDestination(to, callback) {
        const _to = isString(to) ? to : null;
        const _callback = isFunction(callback) ? callback : null;

        if (!_to) { throw makeInvalidArgumentError('Graph#forEachEdgesByDestination', 'to', _to); }
        if (!_callback) { throw makeInvalidArgumentError('Graph#forEachEdgesByDestination', 'callback', _callback, 'function'); }

        for (const data of this._edges) {
            if (data.to != _to) { continue; }

            callback(data.key, data.from, data.to, {...data.attributes});
        }
    }

    forEachEdgesByPath(from, to, callback) {
        const _from = isString(from) ? from : null;
        const _to = isString(to) ? to : null;
        const _callback = isFunction(callback) ? callback : null;

        if (!_from) { throw makeInvalidArgumentError('Graph#forEachEdgesByPath', 'from', _from); }
        if (!_to) { throw makeInvalidArgumentError('Graph#forEachEdgesByPath', 'to', _to); }
        if (!_callback) { throw makeInvalidArgumentError('Graph#forEachEdgesByPath', 'callback', _callback, 'function'); }

        for (const data of this._edges) {
            if (data.from != _from) { continue; }
            if (data.to != _to) { continue; }

            callback(data.key, data.from, data.to, {...data.attributes});
        }
    }

    forEachEdgeIds(ids, callback) {
        const _ids = Array.isArray(ids) ? ids : null;
        const _callback = isFunction(callback) ? callback : null;

        if (!ids || !_ids.every(isString)) { throw makeInvalidArgumentError('Graph#forEachEdgeIds', 'ids', _ids, 'array of strings'); }
        if (!_callback) { throw makeInvalidArgumentError('Graph#forEachEdgeIds', 'callback', _callback, 'function'); }

        for (id of _ids) {
            const data = this._edges.get(id);
            const ins = Object.keys(data.in) || [];
            const outs = Object.keys(data.out) || [];
            callback(data.key, data.from, data.to, {...data.attributes});
        }
    }

    getEdgeAttribute(edge, name) {
        const _edge = isString(edge) ? edge : null;
        const _name = isString(name) ? name : null;

        if (!_edge) { throw makeInvalidArgumentError('Graph#getEdgeAttribute', 'edge',  _edge); }
        if (!_name) { throw makeInvalidArgumentError('Graph#getEdgeAttribute', 'name',  _name); }
        if (!this.hasEdge(_edge)) { throw makeKeyUnknownError('Graph#getEdgeAttribute', 'edge', _edge); }

        const data = this._edges.get(_edge);
        return data.attributes[_name];
    }

    getEdgeAttributes(edge) {
        const _edge = isString(edge) ? edge : null;

        if (!_edge) { throw makeInvalidArgumentError('Graph#getEdgeAttributes', 'edge', _edge); }
        if (!this.hasEdge(_edge)) { throw makeKeyUnknownError('Graph#getEdgeAttributes', 'edge', _edge); }

        const data = this._edges.get(_edge);
        return data.attributes;
    }

    updateEdgeAttribute(edge, name, updater) {
        const _edge = isString(edge) ? edge : null;
        const _name = isString(name) ? name : null;
        const _updater = isFunction(updater) ? updater : null;

        if (!_edge) { throw makeInvalidArgumentError('Graph#updateEdgeAttribute', 'edge', _edge); }
        if (!_name) { throw makeInvalidArgumentError('Graph#updateEdgeAttribute', 'name', _name); }
        if (!_updater) { throw makeInvalidArgumentError('Graph#updateEdgeAttribute', 'updater', _updater, 'function'); }
        if (!this.hasEdge(_edge)) { throw makeKeyUnknownError('Graph#updateEdgeAttribute', 'edge', _edge); }

        const data = this._edges.get(_edge);
        data.attributes[_name] = _updater(data.attributes[_name]);
    }

    setEdgeAttribute(edge, name, value) {
        const _edge = isString(edge) ? edge : null;
        const _name = isString(name) ? name : null;

        if (!_edge) { throw makeInvalidArgumentError('Graph#setEdgeAttribute', 'edge', _edge); }
        if (!_name) { throw makeInvalidArgumentError('Graph#setEdgeAttribute', 'name', _name); }
        if (!this.hasEdge(_edge)) { throw makeKeyUnknownError('Graph#setEdgeAttribute', 'edge', _edge); }

        const data = this._edges.get(_edge);
        data.attributes[_name] = value;
    }

    setEdgeAttributes(edge, attributes) {
        const _edge = isString(edge) ? edge : null;

        if (!_edge) { throw makeInvalidArgumentError('Graph#setEdgeAttributes', 'edge', _edge); }
        if (!isPlainObject(attributes)) { throw makeInvalidArgumentError('Graph#setEdgeAttributes', 'attributes', attributes, 'plain object'); }
        if (!this.hasEdge(_edge)) { throw makeKeyUnknownError('Graph#setEdgeAttributes', 'edge', _edge); }

        const data = this._edges.get(_edge);
        data.attributes = attributes;
    }

    print() {
        let text = 'Graph {\n';
        for (const [nodeKey, nodeData] of this._nodes.entries()) {
            text += '  [' + nodeKey + ']\n'
            Object.keys(nodeData.out).forEach((outEdgeKey) => {
                const edgeSet = nodeData.out[outEdgeKey];
                let index = 0;
                for (const edge of edgeSet) {
                    text += `    (${++index}) ${edge.from}->${edge.to}\n`;
                }
            });
        }
        text += '}\n';
        return text;
    }

    inspect() {
        return `Graph { nodes[${this._nodes.size}], edges[${this._edges.size}] }`;
    }
}

Graph.Node = Node;
Graph.Edge = Edge;

module.exports = Graph;

if (typeof module != 'undefined' && require.main === module) {
    function make() {
        const graph = new Graph();

        graph.addNode('Paris');
        graph.addNode('Montreal');
        graph.addNode('London');
        graph.addNode('Toronto');

        graph.addEdge('Montreal', 'Paris', { name: 'AC123' });
        graph.addEdge('Montreal', 'Paris', { name: 'AF456' });
        graph.addEdge('London', 'Paris', { name: 'BA134' });
        graph.addEdge('Paris', 'London', { name: 'AF045' });
        graph.addEdge('London', 'Toronto', { name: 'AC789' });
        graph.addEdge('Toronto', 'Montreal', { name: 'AC098' });
        graph.addEdge('Montreal', 'Toronto', { name: 'BA435' });
        graph.addEdge('Toronto', 'London', { name: 'BA567' });

        console.log(graph.print());
        console.log('----');
        for (let o of graph.getNodes()) { console.log(o); }
    }
    make();
}
