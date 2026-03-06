import { ECDH } from 'node:crypto';
import {
    type Pair, pair, head, tail,
    type List, is_null, for_each, filter, enum_list, list, map
} from './list';

import { build_array, lg_dfs_visit_order } from "../lib/graphs"
import {
    type Queue, empty, is_empty, enqueue, dequeue, head as qhead
} from './queue_array';

type Machine = {
  id: 0
  ip: string
  hostname?: string
}

export type Subnet = {
  network: string;
  mask: number;
};

export type ListGraph = {
  adj: Array<List<number>>;
  size: number;
};

const machines: Machine[] = [
  { ip: "192.168.1.10", subnet: "192.168.1.0/24" },
  { ip: "192.168.1.12", subnet: "192.168.1.0/24" },
  { ip: "192.168.2.5", subnet: "192.168.2.0/24" }
];
/*
 * Node colours for traversal algorithms
 * @constant white an unvisited node
 * @constant grey a visited but not finished node
 * @constant black a finished node
 */
const white = 1;
const grey = 2;
const black = 3;