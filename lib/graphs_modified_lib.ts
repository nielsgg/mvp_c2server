import { ECDH } from 'node:crypto';
import {
    type Pair, pair, head, tail,
    type List, is_null, for_each, filter, enum_list, list
} from './list';

import { build_array } from "../lib/graphs"
import {
    type Queue, empty, is_empty, enqueue, dequeue, head as qhead
} from '../../lib/queue_array';
//modified lib for listgraph

export type Node = {
    to: number;
    type: EdgeType;
};

export type ListGraph = {
    adj: Array<List<Node>>, 
    size: number
};

export type EdgeType =
  | "SHARED_SERVICE"
  | "SHARED_PRODUCT"
  | "SHARED_VERSION"
  | "SHARED_OS"
  | "NETWORK_HOP";

const listgraph: ListGraph = {
  adj: [
    list(
      { to: 1, type: "SHARED_SERVICE" }, // node 0
      { to: 1, type: "SHARED_VERSION" },
      { to: 2, type: "NETWORK_HOP" }
    ),

    list(
      { to: 2, type: "SHARED_OS" } // node 1
    ),

    list() // node 2
  ],
  size: 3
};
/*
 * Node colours for traversal algorithms
 * @constant white an unvisited node
 * @constant grey a visited but not finished node
 * @constant black a finished node
 */
const white = 1;
const grey = 2;
const black = 3;

export function lg_bfs_visit_order({adj, size}: ListGraph,
                                   initial: number = 0): Queue<number> {

    const result  = empty<number>();
    const pending = empty<number>();
    const colour  = build_array(size, _ => white);

    function bfs_visit(current: number) {
        colour[current] = grey;
        enqueue(current, result);
        enqueue(current, pending);
    }

    bfs_visit(initial);

    while (!is_empty(pending)) {

        const current = qhead(pending);
        dequeue(pending);

        // convert edges -> neighbor numbers
        const neighbours =
            map(edge => edge.to, adj[current]);

        const adjacent_white_nodes =
            filter(node => colour[node] === white,
                   neighbours);

        for_each(bfs_visit, adjacent_white_nodes);

        colour[current] = black;
    }

    return result;
}