import {
    for_each, filter, list, head, tail, List, pair, Pair
    , accumulate
} from '../../lib/list';

import {
    type Queue, empty, is_empty, enqueue, dequeue, head as qhead
} from '../../lib/queue_array';
import {
    lg_from_edges,
} from "../../lib/graphs";
import {Edge, EdgeType, ListGraph, lg_bfs_visit_order, } from "./hashtables_modified_lib"


const listgraph: Node {
    adj [list()
        list()
        list()
        list()
    ],
    entries: 4
}

