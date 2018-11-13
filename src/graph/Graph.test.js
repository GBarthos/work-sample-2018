const tap = require('tap');

const {
    GraphError,
    InvalidArgumentGraphError,
    KeyUnknownGraphError,
} = require('./errors.js');

const Graph = require('./Graph.js');
const { Node, Edge } = Graph;

tap.test('src/graph/Graph.js', async() => {
    const noop = () => {};
    const date = new Date();
    const map = new Map();
    const regex = /regex/;

    const nonStringValues = [true, false, 0, 123, NaN, undefined, null, [], [1], {}, {a:1}, noop, regex, date, map];
    const nonFunctionValues = [true, false, 0, 123, NaN, undefined, null, [], [1], {}, {a:1}, '', 'asdf', regex, date, map];

    tap.test('Node', async() => {
        tap.test('constructor', async() => {
            tap.test('initialize with no parameters', async() => {
                const node = new Node();
                tap.match(node.key, undefined);
                tap.match(node.attributes, {});
                tap.match(node.out, {});
                tap.match(node.in, {});
            });

            tap.test('initialize with "key" parameter', async() => {
                const node = new Node('key');
                tap.match(node.key, 'key');
                tap.match(node.attributes, {});
                tap.match(node.out, {});
                tap.match(node.in, {});
            });

            tap.test('initialize with "attributes" parameter', async() => {
                const node = new Node('', { a: 1 });
                tap.match(node.key, '');
                tap.match(node.attributes, { a: 1 });
                tap.match(node.out, {});
                tap.match(node.in, {});
            });
        });
    });

    tap.test('Edge', async() => {
        tap.test('constructor', async() => {
            tap.test('initialize with no parameters', async() => {
                const edge = new Edge();
                tap.match(edge.key, undefined);
                tap.match(edge.attributes, {});
                tap.match(edge.from, null);
                tap.match(edge.to, null);
            });

            tap.test('initialize with "key" parameter', async() => {
                const edge = new Edge('key');
                tap.match(edge.key, 'key');
                tap.match(edge.from, null);
                tap.match(edge.to, null);
                tap.match(edge.attributes, {});
            });

            tap.test('initialize with "from" parameter', async() => {
                const edge = new Edge(undefined, 'from');
                tap.match(edge.key, undefined);
                tap.match(edge.from, 'from');
                tap.match(edge.to, null);
                tap.match(edge.attributes, {});
            });

            tap.test('initialize with "to" parameter', async() => {
                const edge = new Edge(undefined, undefined, 'to');
                tap.match(edge.key, undefined);
                tap.match(edge.from, undefined);
                tap.match(edge.to, 'to');
                tap.match(edge.attributes, {});
            });

            tap.test('initialize with "attributes" parameter', async() => {
                const edge = new Edge(undefined, undefined, undefined, { a: 1 });
                tap.match(edge.key, undefined);
                tap.match(edge.from, null);
                tap.match(edge.to, null);
                tap.match(edge.attributes, { a: 1 });
            });
        });
    });

    tap.test('Graph', async() => {
        tap.test('constructor', async() => {
            const graph = new Graph();
            tap.match(graph._nodes, new Map());
            tap.match(graph._edges, new Map());
        });

        tap.test('order', async() => {
            const graph = new Graph();
            tap.equal(graph.order, 0);

            graph.addNode('test');
            tap.equal(graph.order, 1);
        });

        tap.test('size', async() => {
            const graph = new Graph();
            tap.equal(graph.size, 0);

            graph._edges.set('test', new Edge());
            tap.equal(graph.size, 1);
        });

        tap.test('isEmpty', async() => {
            tap.test('should return "true" when graph has no node nor edge', async() => {
                const graph = new Graph();
                tap.equal(graph.isEmpty(), true);
            });

            tap.test('should return "false" when graph has at least a node', async() => {
                const graph = new Graph();
                graph.addNode('test');
                tap.equal(graph.isEmpty(), false);
            });

            tap.test('should return "false" when graph has at least an edge', async() => {
                const graph = new Graph();
                graph._edges.set('test', new Edge());
                tap.equal(graph.isEmpty(), false);
            });
        });

        tap.test('addNode', async() => {
            tap.test('should throw when given invalid parameter', async() => {
                const graph = new Graph();

                nonStringValues.forEach((value) => {
                    tap.throws(() => { graph.addNode(value) }, InvalidArgumentGraphError);
                });
                tap.throws(() => { graph.addNode('') }, InvalidArgumentGraphError);
            });

            tap.test('should throw when given an already existing key', async() => {
                const graph = new Graph();
                graph.addNode('test')
                tap.throws(() => { graph.addNode('test') }, GraphError);
            });

            tap.test('should add a node to the graph', async() => {
                const graph = new Graph();
                const key = graph.addNode('test', { a: 1 });
                const node = graph._nodes.get(key);

                tap.isa(node, Node);
                tap.match(node.key, 'test');
                tap.match(node.in, {});
                tap.match(node.out, {});
                tap.match(node.attributes, { a: 1 });
            });
        });

        tap.test('hasNode', async() => {
            tap.test('should throw when given invalid parameter', async() => {
                const graph = new Graph();

                nonStringValues.forEach((value) => {
                    tap.throws(() => { graph.hasNode(value) }, InvalidArgumentGraphError);
                });
                tap.throws(() => { graph.hasNode('') }, InvalidArgumentGraphError);
            });

            tap.test('should return if graph has the given key', async() => {
                const graph = new Graph();
                tap.equal(graph.hasNode('test'), false);
                graph.addNode('test', { a: 1 });
                tap.equal(graph.hasNode('test'), true);
            });
        });

        tap.todo('forEachNodes', async() => {
            // TODO
        });

        tap.todo('forNode', async() => {
            // TODO
        });

        tap.test('getNodeAttributes', async() => {
            tap.test('should throw when given invalid parameter', async() => {
                const graph = new Graph();
                graph.addNode('test', { a: 1 });

                nonStringValues.forEach((value) => {
                    tap.throws(() => { graph.getNodeAttributes(value) }, InvalidArgumentGraphError);
                });
                tap.throws(() => { graph.getNodeAttributes('') }, InvalidArgumentGraphError);
            });

            tap.test('should throw when given key does not exist', async() => {
                const graph = new Graph();
                tap.throws(() => { graph.getNodeAttributes('test') }, KeyUnknownGraphError);
            });

            tap.test('should return an attribute associated with the given node', async() => {
                const graph = new Graph();
                graph.addNode('test', { a: 1 });
                tap.match(graph.getNodeAttributes('test'), { a: 1 });
            });
        });

        tap.test('getNodeAttribute', async() => {
            tap.test('should throw when given invalid parameter', async() => {
                const graph = new Graph();
                graph.addNode('test', { a: 1 });

                nonStringValues.forEach((value) => {
                    tap.throws(() => { graph.getNodeAttribute(value, 'a') }, InvalidArgumentGraphError);
                    tap.throws(() => { graph.getNodeAttribute('test', value) }, InvalidArgumentGraphError);
                });
                tap.throws(() => { graph.getNodeAttribute('', 'a') }, InvalidArgumentGraphError);
                tap.throws(() => { graph.getNodeAttribute('test', '') }, InvalidArgumentGraphError);
            });

            tap.test('should throw when given key does not exist', async() => {
                const graph = new Graph();
                tap.throws(() => { graph.getNodeAttribute('test', 'a') }, KeyUnknownGraphError);
            });

            tap.test('should return an attribute associated with the given node', async() => {
                const graph = new Graph();
                graph.addNode('test', { a: 1 });
                tap.equal(graph.getNodeAttribute('test', 'a'), 1);
            });
        });

        tap.test('updateNodeAttribute', async() => {
            tap.test('should throw when given invalid parameter', async() => {
                const graph = new Graph();
                graph.addNode('test', { a: 1 });

                nonStringValues.forEach((value) => {
                    tap.throws(() => { graph.updateNodeAttribute(value, 'a', noop) }, InvalidArgumentGraphError);
                    tap.throws(() => { graph.updateNodeAttribute('test', value, noop) }, InvalidArgumentGraphError);
                });

                tap.throws(() => { graph.updateNodeAttribute('', 'a', noop) }, InvalidArgumentGraphError);
                tap.throws(() => { graph.updateNodeAttribute('test', '', noop) }, InvalidArgumentGraphError);

                nonFunctionValues.forEach((value) => {
                    tap.throws(() => { graph.updateNodeAttribute('test', 'a', value) }, InvalidArgumentGraphError);
                });
            });

            tap.test('should throw when given key does not exist', async() => {
                const graph = new Graph();
                tap.throws(() => { graph.updateNodeAttribute('test', 'a', noop) }, KeyUnknownGraphError);
            });

            tap.test('should update an attribute associated with the given node', async() => {
                const graph = new Graph();
                graph.addNode('test', { a: 1 });
                graph.updateNodeAttribute('test', 'a', (value) => ++value);
                tap.equal(graph.getNodeAttribute('test', 'a'), 2);
            });
        });

        tap.test('setNodeAttributes', async() => {
            tap.test('should throw when given invalid parameter', async() => {
                const graph = new Graph();
                graph.addNode('test', { a: 1 });

                nonStringValues.forEach((value) => {
                    tap.throws(() => { graph.setNodeAttributes(value, { b: 2 }) }, InvalidArgumentGraphError);
                });
                tap.throws(() => { graph.setNodeAttributes('', { b: 2 }) }, InvalidArgumentGraphError);
            });

            tap.test('should throw when given key does not exist', async() => {
                const graph = new Graph();
                tap.throws(() => { graph.setNodeAttributes('test', { b: 2 }) }, KeyUnknownGraphError);
            });

            tap.test('should set the attributes associated with the given node', async() => {
                const graph = new Graph();
                graph.addNode('test', { a: 1 });
                graph.setNodeAttributes('test', { b: 2 });
                tap.match(graph.getNodeAttributes('test'), { b: 2 });
            });
        });

        tap.test('setNodeAttribute', async() => {
            tap.test('should throw when given invalid parameter', async() => {
                const graph = new Graph();
                graph.addNode('test', { a: 1 });

                nonStringValues.forEach((value) => {
                    tap.throws(() => { graph.setNodeAttribute(value, 'a', 2) }, InvalidArgumentGraphError);
                    tap.throws(() => { graph.setNodeAttribute('test', value, 2) }, InvalidArgumentGraphError);
                });
                tap.throws(() => { graph.setNodeAttribute('', 'a', 2) }, InvalidArgumentGraphError);
                tap.throws(() => { graph.setNodeAttribute('test', '', 2) }, InvalidArgumentGraphError);
            });

            tap.test('should throw when given key does not exist', async() => {
                const graph = new Graph();
                tap.throws(() => { graph.setNodeAttribute('test', 'a', 2) }, KeyUnknownGraphError);
            });

            tap.test('should set an attribute associated with the given node', async() => {
                const graph = new Graph();
                graph.addNode('test', { a: 1 });
                graph.setNodeAttribute('test', 'a', 2);
                graph.setNodeAttribute('test', 'b', 2);
                tap.match(graph.getNodeAttributes('test'), { a: 2, b: 2 });
            });
        });

        tap.test('addEdge', async() => {
            tap.test('should throw when given invalid parameter', async() => {
                const graph = new Graph();
                graph.addNode('node1');
                graph.addNode('node2');

                nonStringValues.forEach((value) => {
                    tap.throws(() => { graph.addEdge(value, 'node2') }, InvalidArgumentGraphError);
                    tap.throws(() => { graph.addEdge('node1', value) }, InvalidArgumentGraphError);
                });

                tap.throws(() => { graph.addEdge('', 'node2') }, InvalidArgumentGraphError);
                tap.throws(() => { graph.addEdge('node1', '') }, InvalidArgumentGraphError);
            });

            tap.test('should throw when given an already existing key', async() => {
                const graph = new Graph();
                graph.addNode('node1');
                graph.addNode('node2');

                tap.throws(() => { graph.addEdge('test', 'node2') }, KeyUnknownGraphError);
                tap.throws(() => { graph.addEdge('node1', 'test') }, KeyUnknownGraphError);
            });

            tap.test('should add a node to the graph', async() => {
                const graph = new Graph();
                graph.addNode('node1');
                graph.addNode('node2');
                const key = graph.addEdge('node1', 'node2', { a: 1 });
                const edge = graph._edges.get(key);

                tap.isa(edge, Edge);
                tap.match(edge.key, 'edgeId(1)');
                tap.match(edge.from, 'node1');
                tap.match(edge.to, 'node2');
                tap.match(edge.attributes, { a: 1 });
            });
        });

        tap.test('hasEdge', async() => {
            tap.test('should throw when given invalid parameter', async() => {
                const graph = new Graph();

                nonStringValues.forEach((value) => {
                    tap.throws(() => { graph.hasEdge(value) }, InvalidArgumentGraphError);
                });
                tap.throws(() => { graph.hasEdge('') }, InvalidArgumentGraphError);
            });

            tap.test('should return if graph has the given key', async() => {
                const graph = new Graph();
                graph.addNode('node1');
                graph.addNode('node2');

                tap.equal(graph.hasEdge('test'), false);
                const key = graph.addEdge('node1', 'node2', { a: 1 });
                tap.equal(graph.hasEdge(key), true);
            });
        });

        tap.todo('forEachEdges', async() => {
            // TODO
        });

        tap.todo('forEdge', async() => {
            // TODO
        });

        tap.todo('forEachEdgesBySource', async() => {
            // TODO
        });

        tap.todo('forEachEdgesByDestination', async() => {
            // TODO
        });

        tap.todo('forEachEdgesByPath', async() => {
            // TODO
        });

        tap.test('getEdgeAttributes', async() => {
            tap.test('should throw when given invalid parameter', async() => {
                const graph = new Graph();

                nonStringValues.forEach((value) => {
                    tap.throws(() => { graph.getEdgeAttributes(value) }, InvalidArgumentGraphError);
                });
                tap.throws(() => { graph.getEdgeAttributes('') }, InvalidArgumentGraphError);
            });

            tap.test('should throw when given key does not exist', async() => {
                const graph = new Graph();
                tap.throws(() => { graph.getEdgeAttributes('test') }, KeyUnknownGraphError);
            });

            tap.test('should return an attribute associated with the given node', async() => {
                const graph = new Graph();
                graph.addNode('node1');
                graph.addNode('node2');
                const key = graph.addEdge('node1', 'node2', { a: 1 });

                tap.match(graph.getEdgeAttributes(key), { a: 1 });
            });
        });

        tap.test('getEdgeAttribute', async() => {
            tap.test('should throw when given invalid parameter', async() => {
                const graph = new Graph();
                graph.addNode('node1');
                graph.addNode('node2');
                const key = graph.addEdge('node1','node2', { a: 1 });

                nonStringValues.forEach((value) => {
                    tap.throws(() => { graph.getEdgeAttribute(value, 'a') }, InvalidArgumentGraphError);
                    tap.throws(() => { graph.getEdgeAttribute('test', value) }, InvalidArgumentGraphError);
                });

                tap.throws(() => { graph.getEdgeAttribute('', 'a') }, InvalidArgumentGraphError);
                tap.throws(() => { graph.getEdgeAttribute('test', '') }, InvalidArgumentGraphError);
            });

            tap.test('should throw when given key does not exist', async() => {
                const graph = new Graph();
                tap.throws(() => { graph.getEdgeAttribute('test', 'a') }, KeyUnknownGraphError);
            });

            tap.test('should return an attribute associated with the given node', async() => {
                const graph = new Graph();
                graph.addNode('node1');
                graph.addNode('node2');
                const key = graph.addEdge('node1','node2', { a: 1 });
                tap.equal(graph.getEdgeAttribute(key, 'a'), 1);
            });
        });

        tap.test('updateEdgeAttribute', async() => {
            tap.test('should throw when given invalid parameter', async() => {
                const graph = new Graph();
                graph.addNode('test', { a: 1 });

                nonStringValues.forEach((value) => {
                    tap.throws(() => { graph.updateEdgeAttribute(value, 'a', noop) }, InvalidArgumentGraphError);
                    tap.throws(() => { graph.updateEdgeAttribute('test', value, noop) }, InvalidArgumentGraphError);
                });

                tap.throws(() => { graph.updateEdgeAttribute('', 'a', noop) }, InvalidArgumentGraphError);
                tap.throws(() => { graph.updateEdgeAttribute('test', '', noop) }, InvalidArgumentGraphError);

                nonFunctionValues.forEach((value) => {
                    tap.throws(() => { graph.updateEdgeAttribute('test', 'a', value) }, InvalidArgumentGraphError);
                });
            });

            tap.test('should throw when given key does not exist', async() => {
                const graph = new Graph();
                tap.throws(() => { graph.updateEdgeAttribute('test', 'a', noop) }, KeyUnknownGraphError);
            });

            tap.test('should update an attribute associated with the given node', async() => {
                const graph = new Graph();
                graph.addNode('node1');
                graph.addNode('node2');
                const key = graph.addEdge('node1', 'node2', { a: 1 });
                tap.equal(graph.getEdgeAttribute(key, 'a'), 1);
                graph.updateEdgeAttribute(key, 'a', (value) => ++value);
                tap.equal(graph.getEdgeAttribute(key, 'a'), 2);
            });
        });

        tap.test('setEdgeAttributes', async() => {
            tap.test('should throw when given invalid parameter', async() => {
                const graph = new Graph();

                nonStringValues.forEach((value) => {
                    tap.throws(() => { graph.setEdgeAttributes(value, { b: 2 }) }, InvalidArgumentGraphError);
                });
                tap.throws(() => { graph.setEdgeAttributes('', { b: 2 }) }, InvalidArgumentGraphError);
            });

            tap.test('should throw when given key does not exist', async() => {
                const graph = new Graph();
                tap.throws(() => { graph.setEdgeAttributes('test', { b: 2 }) }, KeyUnknownGraphError);
            });

            tap.test('should set the attributes associated with the given node', async() => {
                const graph = new Graph();
                graph.addNode('node1');
                graph.addNode('node2');
                const key = graph.addEdge('node1', 'node2', { a: 1 });
                graph.setEdgeAttributes(key, { b: 2 });
                tap.match(graph.getEdgeAttributes(key), { b: 2 });
            });
        });

        tap.test('setEdgeAttribute', async() => {
            tap.test('should throw when given invalid parameter', async() => {
                const graph = new Graph();

                nonStringValues.forEach((value) => {
                    tap.throws(() => { graph.setEdgeAttribute(value, 'a', 2) }, InvalidArgumentGraphError);
                    tap.throws(() => { graph.setEdgeAttribute('test', value, 2) }, InvalidArgumentGraphError);
                });

                tap.throws(() => { graph.setEdgeAttribute('', 'a', 2) }, InvalidArgumentGraphError);
                tap.throws(() => { graph.setEdgeAttribute('test', '', 2) }, InvalidArgumentGraphError);
            });

            tap.test('should throw when given key does not exist', async() => {
                const graph = new Graph();
                tap.throws(() => { graph.setEdgeAttribute('test', 'a', 2) }, KeyUnknownGraphError);
            });

            tap.test('should set an attribute associated with the given node', async() => {
                const graph = new Graph();
                graph.addNode('node1');
                graph.addNode('node2');
                const key = graph.addEdge('node1', 'node2', { a: 1 });
                graph.setEdgeAttribute(key, 'a', 2);
                graph.setEdgeAttribute(key, 'b', 2);
                tap.match(graph.getEdgeAttributes(key), { a: 2, b: 2 });
            });
        });

        tap.test('print', async() => {
            tap.test('should print an empty graph', async() => {
                const graph = new Graph();
                tap.match(graph.print(), 'Graph {\n}\n');
            });

            tap.test('should print a graph accordingly', async() => {
                const graph = new Graph();

                graph.addNode('node1');
                graph.addNode('node2');
                graph.addNode('node3');
                graph.addNode('node4');

                graph.addEdge('node2', 'node1', { a: 123 });
                graph.addEdge('node2', 'node1', { a: 234 });
                graph.addEdge('node3', 'node1', { a: 345 });
                graph.addEdge('node1', 'node3', { a: 456 });
                graph.addEdge('node3', 'node4', { a: 567 });
                graph.addEdge('node4', 'node2', { a: 678 });
                graph.addEdge('node2', 'node4', { a: 789 });
                graph.addEdge('node4', 'node3', { a: 890 });

                const text = (
                    'Graph {\n' +
                    '  [node1]\n' +
                    '    (1) node1->node3\n' +
                    '  [node2]\n' +
                    '    (1) node2->node1\n' +
                    '    (2) node2->node1\n' +
                    '    (1) node2->node4\n' +
                    '  [node3]\n' +
                    '    (1) node3->node1\n' +
                    '    (1) node3->node4\n' +
                    '  [node4]\n' +
                    '    (1) node4->node2\n' +
                    '    (1) node4->node3\n' +
                    '}\n'
                );
                tap.match(graph.print(), text);
            });
        });
    });
});
