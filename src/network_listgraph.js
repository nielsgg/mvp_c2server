"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var list_1 = require("../lib/list");
var queue_array_1 = require("../lib/queue_array");
var graphs_1 = require("../lib/graphs");
var machines = [
    { ip: "192.168.1.10", subnet: { network: "192.168.1.0", mask: 24 } }, //0
    { ip: "192.168.1.12", subnet: { network: "192.168.1.0", mask: 24 } }, //1
    { ip: "192.168.2.5", subnet: { network: "192.168.1.0", mask: 24 } } //2
];
var listgraph = {
    adj: [
        (0, list_1.list)(1), // node 0 shares subnet with 1
        (0, list_1.list)(0), // node 1 shares subnet with 0
        (0, list_1.list)(3), // node 2 share subnet with 2
        (0, list_1.list)(2)
    ], //node 3 shares subnet with 2
    size: 4
};
/**
 * Finds all nodes connected to the same subnets in a ListGraph.
 * @param graph - A ListGraph
 * @preconditions - graph must be a valid ListGraph.
 * @returns - An array of components, each containing node indices
 */
function traverse_subnets(graph) {
    // Build array that tracks visited nodes
    var visited = (0, graphs_1.build_array)(graph.size, function () { return false; });
    // 2D array that stores processed results
    var clusters = [];
    for (var i = 0; i < graph.size; i++) {
        if (!visited[i]) {
            var queue = (0, graphs_1.lg_bfs_visit_order)(graph, i);
            // Stores nodes belonging to current subnet
            var component = [];
            // process BFS result
            while (!(0, queue_array_1.is_empty)(queue)) {
                var node = (0, queue_array_1.head)(queue);
                (0, queue_array_1.dequeue)(queue);
                visited[node] = true;
                component.push(node);
            }
            // push processed result to 2D array clusters
            clusters.push(component);
        }
    }
    return clusters;
}
console.log(traverse_subnets(listgraph));
