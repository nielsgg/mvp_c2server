import { list, map, pair, reverse, length } from '../lib/list';

import {
    is_empty, dequeue, head as qhead } from '../lib/queue_array';
import {
     ListGraph, lg_bfs_visit_order, build_array, EdgeList, lg_from_edges
} from "../lib/graphs";
import { Machine } from './clientDataManager';

import { machines } from '../parser/parser'

// Finds machines with the same subnet in /24 subnet
function same_subnet(machine1: Machine, machine2: Machine): boolean {
  const a = machine1.ip.split(".");
  const b = machine2.ip.split(".");
  return a[0] === b[0] &&
         a[1] === b[1] &&
         a[2] === b[2];
}

//prints EdgeList correctly (for testing)
function print_edges(edges: EdgeList) {
  while (edges !== null) {
    const edge = edges[0];
    console.log(edge);
    edges = edges[1];
  }
}

// Create a edgelist
function create_edgelist(machines: Array<Machine>): EdgeList {

    let edges: EdgeList = null;

for (let i = 0; i < machines.length; i++) {
  for (let j = i + 1; j < machines.length; j++) {

    if (same_subnet(machines[i]!, machines[j]!)) {

    //creates the list edges backwards
      edges = pair(pair(i,j), edges);
      edges = pair(pair(j,i), edges);

    }
  }
}
    return reverse(edges);
}

//check if EdgeList is created correctly
print_edges(create_edgelist(machines));

//create ListGraph from EdgeList
const listgraph2 = lg_from_edges(
    machines.length,
    create_edgelist(machines)
  );
//console.log(listgraph2);

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

console.log(traverse_subnets(listgraph2));




