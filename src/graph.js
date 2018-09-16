function nodeHasNotBeenVisited(path, start, node) {
    const list = path.map((flight) => flight.destination)
    return !(
        list.includes(start) ||
        list.includes(node.destination)
    );
}

// function findMostAffordable(graph, start, origin, destination, path = [], count = 0) {
//     console.log('count', count);
//     console.log('path', path);
//     console.log(origin, '->', destination);
//     // if (count > 3) { return }
//     const edges = graph[origin];

//     if (!edges) {
//         console.log('unknown destination !');
//         return null;
//     }
//     if (origin === destination) {
//         console.log('found destination !');
//         return path;
//     }
//     console.log('edges', edges);
//     let mostAffordablePath = null;
//     let foundDirectPath = false;

//     (edges).forEach((node) => {
//         if (nodeHasNotBeenVisited(path, start, node)) {
//             console.log('path.length', path.length);
//             console.log('destination', {number: node.number, dest: node.destination });
//             if (node.destination === destination) {
//                 foundDirectPath = true;
//             }
//             if (foundDirectPath && nodeHasDirectPath(destination, node)) {}
//             // const newPath = path.concat(node);
//             const newPath = findMostAffordable(graph, start, node.destination, destination, [...path, node], ++count);
//             console.log('newPath', newPath);
//             if (newPath) {
//                 if (!mostAffordablePath) {
//                     mostAffordablePath = newPath
//                     console.log('"mostAffordablePath" default set to "newPath"');
//                 } else {
//                     const newPathPrice = computeTotalPrice(newPath);
//                     const mostAffordablePathPrice = computeTotalPrice(mostAffordablePath);
//                     if (newPathPrice < mostAffordablePathPrice) {
//                         mostAffordablePath = newPath;
//                         console.log('"mostAffordablePath" set to least pricy "newPath"', newPathPrice, mostAffordablePathPrice);
//                     }
//                 }
//             }
//         }
//     });

//     return mostAffordablePath;
// }

/**
 * Provide an array of all possible paths for going from origin
 * to destination.
 *
 * @param {Object} graph object linking airports to flights
 * @param {String} start airport name starting from
 * @param {String} origin airport name to start from
 * @param {String} destination airport name to arrive at
 * @param {Array} path array of flight to take to go from origin to destination
 * @param {*} count
 * @returns an array of array of flights
 */
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

module.exports = {
    findAllPaths
};
