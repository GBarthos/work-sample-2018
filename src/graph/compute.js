const Graph = require('./graph/Graph.js');

function findAllPaths(graph, start, finish) {
    if (!graph || !(graph instanceof Graph)) {
        throw new TypeError('"findAllPaths" takes a Graph instance as argument [graph]');
    }
    if (graph.isEmpty()) {
        return null;
    }

    function hasBeenVisited(pathList, edge) {
        const list = pathList.map((item) => item.to)
        return (
            list.includes(start) ||
            list.includes(edge.to)
        );
    }

    function _findAllPaths(graph, origin, destination, result = {}) {
        const node = graph.getNode(origin);
        const edges = node[destination];

        if (!edges) {
            return null;
        }
        if (origin === destination) {
            return result;
        }

        let results = {};
        for (const edge of edges.values()) {
            if (hasBeenVisited(path, edge)) { continue; }
            // ...
        }
    }

    const results = _findAllPaths(graph, start, finish);
    return results;
}

// *** //

function nodeHasNotBeenVisited(path, start, node) {
    const list = path.map((flight) => flight.destination)
    return !(
        list.includes(start) ||
        list.includes(node.destination)
    );
}

function findAllPaths(graph, start, origin, destination, path = [], count = 0) {
    const edges = graph[origin];
    if (!edges) {
        return null;
    }
    if (origin === destination) {
        return [path];
    }
    let paths = [];

    (edges).forEach((node) => {
        if (nodeHasNotBeenVisited(path, start, node)) {
            const newPaths = findAllPaths(graph, start, node.destination, destination, [...path, node], ++count);
            newPaths.forEach((newPath) => paths.push(newPath));
        }
    });
    return paths;
}


module.epxorts = {
    findAllPaths,
};

