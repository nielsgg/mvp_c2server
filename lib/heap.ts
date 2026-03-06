import type { ClientData } from "../src/clientDataManager";
import { 
    type TreeHeap, 
    th_empty, 
    th_insert, 
    th_top, 
    th_remove, 
    th_is_empty 
} from "./heaps";
import { tail } from "./list";

export let heap: TreeHeap<number, ClientData> = th_empty();

/**
 * Creates a composite key for the Min-Heap.
 * 1. Online devices get a base value of 0.
 * 2. Offline devices get a massive penalty so they always rank lower.
 * 3. Adding 'lastSeen' ensures that within each group, the oldest is on top.
 */
export function getPriorityKey(device: ClientData): number {
    const STATUS_PENALTY = 1e15; // A number larger than any possible timestamp
    const statusWeight = device.status === "online" ? 0 : STATUS_PENALTY;
    
    return statusWeight + device.lastSeen;
}

export function resetHeap(): void {
    heap = th_empty();
}

export function heapInsert(device: ClientData): void {
    const key = getPriorityKey(device);
    heap = th_insert(heap, key, device);
}

export function heapExtractMax(): ClientData | null {
    if (th_is_empty(heap)) {
        return null;
    }

    const topPair = th_top(heap);
    const device = tail(topPair);

    heap = th_remove(heap);
    return device;
}