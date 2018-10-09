const { isFunction, isPlainObject, isString } = require('../tools/utils.js');
const { GraphError, makeInvalidArgumentError, makeKeyUnknownError } = require('./errors.js');

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
        this.from = from;
        this.to = to;
    }
}

class Graph {
    constructor() {
        this.nodes = new Map();
        this.edges = new Map();

        this._edgeKeyGenerator = (function() {
            let i = 0;
            return () => `edgeId(${++i})`;
        })();
    }

    hasNode(node) {
        if (!node || !isString(node)) {
            throw makeInvalidArgumentError('Graph#hasNode', 'node', node);
        }

        return this.nodes.has(node);
    }

    addNode(node, attributes) {
        const _node = isString(node) ? node : null;
        const _attributes = isPlainObject(attributes) ? attributes : {};

        if (!_node) { throw makeInvalidArgumentError('Graph#addNode', 'node', _node); }
        if (this.hasNode(node)) { throw new GraphError(`"Graph#addNode" node {${_node}} already exists.`); }


        const data = new Node(node, _attributes);
        this.nodes.set(node, data);

        return node;
    }

    getNodeAttribute(node, name) {
        const _node = isString(node) ? node : null;
        const _name = isString(name) ? name : null;

        if (!_node) { throw makeInvalidArgumentError('Graph#getNodeAttribute', 'node', _node); }
        if (!_name) { throw makeInvalidArgumentError('Graph#getNodeAttribute', 'name', _name); }
        if (!this.hasNode(_node)) { throw makeKeyUnknownError('Graph#getNodeAttribute', 'node', _node); }

        const data = this.nodes.get(_node);
        return data.attributes[_name];
    }

    getNodeAttributes(node) {
        const _node = isString(node) ? node : null;

        if (!_node) { throw makeInvalidArgumentError('Graph#getNodeAttributes', 'node', _node); }
        if (!this.hasNode(_node)) { throw makeKeyUnknownError('Graph#getNodeAttributes', 'node', _node); }

        const data = this.nodes.get(_node);
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

        const data = this.nodes.get(_node);
        data.attributes[_name] = _updater(data.attributes[_name]);
    }

    setNodeAttribute(node, name, value) {
        const _node = isString(node) ? node : null;
        const _name = isString(name) ? name : null;

        if (!_node) { throw makeInvalidArgumentError('Graph#setNodeAttribute', 'node', _node); }
        if (!_name) { throw makeInvalidArgumentError('Graph#setNodeAttribute', 'name', _name); }
        if (!this.hasNode(_node)) { throw makeKeyUnknownError('Graph#setNodeAttribute', 'node', _node); }

        const data = this.nodes.get(_node);
        data.attributes[_name] = value;
    }

    setNodeAttributes(node, attributes) {
        const _node = isString(node) ? node : null;

        if (!_node) { throw makeInvalidArgumentError('Graph#setNodeAttributes', 'node', _node); }
        if (!isPlainObject(attributes)) { throw makeInvalidArgumentError('Graph#setNodeAttributes', 'attributes', attributes, 'plain object'); }
        if (!this.hasNode(_node)) { throw makeKeyUnknownError('Graph#setNodeAttributes', 'node', _node); }

        const data = this.nodes.get(_node);
        data.attributes = attributes;
    }

    hasEdge(edge) {
        if (!edge || !isString(edge)) {
            throw makeInvalidArgumentError('Graph#hasEdge', 'edge', edge);
        }

        return this.edges.has(edge);
    }

    addEdge(from, to, attributes) {
        const _from = isString(from) ? from : null;
        const _to = isString(to) ? to : null;
        const _attributes = isPlainObject(attributes) ? attributes : {};

        if (!_from) { throw makeInvalidArgumentError('Graph#addEdge', 'from', _from); }
        if (!_to) { throw makeInvalidArgumentError('Graph#addEdge', 'to', _to); }

        if (!this.hasNode(_from)) { throw makeKeyUnknownError('Graph#addEdge', 'node', _from); }
        if (!this.hasNode(_to)) { throw makeKeyUnknownError('Graph#addEdge', 'node', _to); }

        const sourceNode = this.nodes.get(_from);
        const targetNode = this.nodes.get(_to);

        // avoid self-looping
        if (sourceNode === targetNode) { throw new GraphError('"Graph#addEdge" can not link a node to itself'); }

        // const edge = `${from}->${to}`; // edge key
        const edge = this._edgeKeyGenerator(); // edge key
        // if (this.hasEdge(edge)) { throw new new KeyConflictGraphError(`"Graph#addEdge" edge`, edge); }

        const data = new Edge(edge, _from, _to, _attributes);
        this.edges.set(edge, data);

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

    getEdgeAttribute(edge, name) {
        const _edge = isString(edge) ? edge : null;
        const _name = isString(name) ? name : null;

        if (!_edge) { throw makeInvalidArgumentError('Graph#getEdgeAttribute', 'edge',  _edge); }
        if (!_name) { throw makeInvalidArgumentError('Graph#getEdgeAttribute', 'name',  _name); }
        if (!this.hasEdge(_edge)) { throw makeKeyUnknownError('Graph#getEdgeAttribute', 'edge', _edge); }

        const data = this.edges.get(_edge);
        return data.attributes[_name];
    }

    getEdgeAttributes(edge) {
        const _edge = isString(edge) ? edge : null;

        if (!_edge) { throw makeInvalidArgumentError('Graph#getEdgeAttributes', 'edge', _edge); }
        if (!this.hasEdge(_edge)) { throw makeKeyUnknownError('Graph#getEdgeAttributes', 'edge', _edge); }

        const data = this.edges.get(_edge);
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

        const data = this.edges.get(_edge);
        data.attributes[_name] = _updater(data.attributes[_name]);
    }

    setEdgeAttribute(edge, name, value) {
        const _edge = isString(edge) ? edge : null;
        const _name = isString(name) ? name : null;

        if (!_edge) { throw makeInvalidArgumentError('Graph#setEdgeAttribute', 'edge', _edge); }
        if (!_name) { throw makeInvalidArgumentError('Graph#setEdgeAttribute', 'name', _name); }
        if (!this.hasEdge(_edge)) { throw makeKeyUnknownError('Graph#setEdgeAttribute', 'edge', _edge); }

        const data = this.edges.get(_edge);
        data.attributes[_name] = value;
    }

    setEdgeAttributes(edge, attributes) {
        const _edge = isString(edge) ? edge : null;

        if (!_edge) { throw makeInvalidArgumentError('Graph#setEdgeAttributes', 'edge', _edge); }
        if (!isPlainObject(attributes)) { throw makeInvalidArgumentError('Graph#setEdgeAttributes', 'attributes', attributes, 'plain object'); }
        if (!this.hasEdge(_edge)) { throw makeKeyUnknownError('Graph#setEdgeAttributes', 'edge', _edge); }

        const data = this.edges.get(_edge);
        data.attributes = attributes;
    }

    print() {
        let text = 'Graph {\n';
        for (const [nodeKey, nodeData] of this.nodes.entries()) {
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
    }
    make();
}
