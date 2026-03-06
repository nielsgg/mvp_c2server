"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var list_1 = require("../lib/list");
var queue_array_1 = require("../lib/queue_array");
var graphs_1 = require("../lib/graphs");
var parser_1 = require("../parser/parser");
// Finds machines with the same subnet in /24 subnet
function same_subnet(machine1, machine2) {
    var a = machine1.ip.split(".");
    var b = machine2.ip.split(".");
    return a[0] === b[0] &&
        a[1] === b[1] &&
        a[2] === b[2];
}
//prints EdgeList correctly (for testing)
function print_edges(edges) {
    while (edges !== null) {
        var edge = edges[0];
        console.log(edge);
        edges = edges[1];
    }
}
// Create a edgelist
function create_edgelist(machines) {
    var edges = null;
    for (var i = 0; i < machines.length; i++) {
        for (var j = i + 1; j < machines.length; j++) {
            if (same_subnet(machines[i], machines[j])) {
                //creates the list edges backwards
                edges = (0, list_1.pair)((0, list_1.pair)(i, j), edges);
                edges = (0, list_1.pair)((0, list_1.pair)(j, i), edges);
            }
        }
    }
    return (0, list_1.reverse)(edges);
}
//check if EdgeList is created correctly
print_edges(create_edgelist(parser_1.machines));
//create ListGraph from EdgeList
var listgraph2 = (0, graphs_1.lg_from_edges)(parser_1.machines.length, create_edgelist(parser_1.machines));
//console.log(listgraph2);
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
console.log(traverse_subnets(listgraph2));
