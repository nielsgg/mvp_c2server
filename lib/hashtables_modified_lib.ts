import { ECDH } from 'node:crypto';
import {
    type Pair, pair, head, tail,
    type List, is_null, for_each, filter, enum_list
} from './list';

import {
    type Queue, empty, is_empty, enqueue, dequeue, head as qhead
} from '../../lib/queue_array';

import { Node } from "../src/network_listgraph";
//modified lib for listgraph

export type EdgeType =
  | "SHARED_SERVICE"
  | "SHARED_PRODUCT"
  | "SHARED_VERSION"
  | "SHARED_OS"
  | "NETWORK_HOP";

export type Node = {
    type: EdgeType;
    to: Node;
    from: Node;
};

const A: Node = {
  id: 0,
  label: "192.168.1.10",
  type: "MACHINE"
};

const B: node = {
  id: 1,
  label: "ssh",
  type: "SERVICE"
};

const C: node = {
  id: 2,
  label: "OpenSSH",
  type: "PRODUCT"
};

const D: node = {
  id: 3,
  label: "8.2",
  type: "VERSION"
};  

const E: node = {
  id: 4,
  label: "Linux",
  type: "OS"
};

const nodes: Array<Node> = [A, B, C, D];


export type ListGraph = {
    adj: array<list>[list(A), //node A
                     list(A, C), // node B
                     list(C) // node C
                     list() // node D
    ], // Lists may not be sorted
    size: number
};


export function lg_bfs_visit_order({adj, size}: ListGraph,
                                   initial: number = 0): Queue<number> {
    const result  = empty<number>();  // nodes in the order they are being visited
    const pending = empty<number>();  // grey nodes to be processed
    const colour  = build_array(size, _ => white);

    // visit a white node
    function bfs_visit(current: number) {
        colour[current] = grey;
        enqueue(current, result);
        enqueue(current, pending);
    }

    // paint initial node grey (all others are initialized to white)
    bfs_visit(initial);

    while (!is_empty(pending)) {
        // dequeue the head node of the grey queue
        const current = qhead(pending);
        dequeue(pending);

        // Paint all white nodes adjacent to current node grey and enqueue them.
        const adjacent_white_nodes = filter(node => colour[node] === white,
                                            adj[current]);
        for_each(bfs_visit, adjacent_white_nodes);

        // paint current node black; the node is now done.
        colour[current] = black;
    }

    return result;
}