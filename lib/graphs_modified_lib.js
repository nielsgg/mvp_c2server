"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lg_bfs_visit_order = lg_bfs_visit_order;
var list_1 = require("./list");
var graphs_1 = require("../lib/graphs");
var queue_array_1 = require("./queue_array");
var listgraph = {
    adj: [
        (0, list_1.list)({ to: 1, type: "SHARED_SERVICE" }, // node 0
        { to: 1, type: "SHARED_VERSION" }, { to: 2, type: "NETWORK_HOP" }),
        (0, list_1.list)({ to: 2, type: "SHARED_OS" } // node 1
        ),
        (0, list_1.list)() // node 2
    ],
    size: 3
};
/*
 * Node colours for traversal algorithms
 * @constant white an unvisited node
 * @constant grey a visited but not finished node
 * @constant black a finished node
 */
var white = 1;
var grey = 2;
var black = 3;
function lg_bfs_visit_order(_a, initial) {
    var adj = _a.adj, size = _a.size;
    if (initial === void 0) { initial = 0; }
    var result = (0, queue_array_1.empty)();
    var pending = (0, queue_array_1.empty)();
    var colour = (0, graphs_1.build_array)(size, function (_) { return white; });
    function bfs_visit(current) {
        colour[current] = grey;
        (0, queue_array_1.enqueue)(current, result);
        (0, queue_array_1.enqueue)(current, pending);
    }
    bfs_visit(initial);
    while (!(0, queue_array_1.is_empty)(pending)) {
        var current = (0, queue_array_1.head)(pending);
        (0, queue_array_1.dequeue)(pending);
        // convert edges -> neighbors
        var neighbours = (0, list_1.map)(function (edge) { return edge.to; }, adj[current]);
        var adjacent_white_nodes = (0, list_1.filter)(function (node) { return colour[node] === white; }, neighbours);
        (0, list_1.for_each)(bfs_visit, adjacent_white_nodes);
        colour[current] = black;
    }
    return result;
}
console.log(lg_bfs_visit_order(listgraph, 0));
