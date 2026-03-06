import {
    for_each, filter, list, head, tail, List, pair, Pair
    , accumulate
} from '../lib/list';

import {
    type Queue, empty, is_empty, enqueue, dequeue, head as qhead
} from '../lib/queue_array';
import {
     ListGraph, lg_bfs_visit_order, build_array
} from "../lib/graphs";

import { Machine, Subnet } from './clientDataManager'


const machines: Machine[] = [
  { ip: "192.168.1.10", subnet: {network: "192.168.1.0", mask: 24 } }, //0
  { ip: "192.168.1.12", subnet: {network: "192.168.1.0",  mask: 24 } }, //1
  { ip: "192.168.2.5", subnet: {network: "192.168.1.0",  mask: 24 } } //2
];

const listgraph: ListGraph = {
  adj: [
    list(1), // node 0 shares subnet with 1
    list(0), // node 1 shares subnet with 0
    list(3),   // node 2 share subnet with 2
    list(2) ], //node 3 shares subnet with 2
  size: 4
};


/**
 * Finds all nodes connected to the same subnets in a ListGraph.
 * @param graph - A ListGraph
 * @preconditions - graph must be a valid ListGraph.
 * @returns - An array of components, each containing node indices
 */
function traverse_subnets(graph: ListGraph): number[][] {

// Build array that tracks visited nodes
const visited: Array<boolean> = build_array(graph.size, () => false);
// 2D array that stores processed results
const clusters: Array<Array<number>> = [];


for (let i = 0; i < graph.size; i++) {

    if (!visited[i]) {

      const queue = lg_bfs_visit_order(graph, i);
      // Stores nodes belonging to current subnet
      const component: Array<number> = [];

      // process BFS result
      while (!is_empty(queue)) {

        const node = qhead(queue);
        dequeue(queue);

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




