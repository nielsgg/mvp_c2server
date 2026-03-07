import type { ClientData } from "../src/clientDataManager";
import { type TreeHeap, th_empty, th_insert, th_top, th_remove, th_is_empty } from "./heaps";
import { tail } from "./list";

/*Code provides functions that are used within server.ts and index.html*/ 

export let heap: TreeHeap<number, ClientData> = th_empty();

// gives a penalty if offline and adds to lastseen
export function getPriorityKey(device: ClientData): number {
    const statusWeight = device.status === "online" ? 0 : 1e15;
    
    return statusWeight - device.lastSeen;
}

// resets the heap so that we can create a new one
export function resetHeap(): void {
    heap = th_empty();
}
// Inserts device into heap with its priority and time, and keps smallest at top (O(log n))
export function heapInsert(device: ClientData): void {
    const key = getPriorityKey(device);
    heap = th_insert(heap, key, device);
}
// Removes root node and restructures, resturns ClientData with smallest priority key (O(log n))
export function heapExtractMin(): ClientData | null {
    if (th_is_empty(heap)) {
        return null;
    }

    const topPair = th_top(heap); // pair(lastseen/priority, ClientData/device)
    const device = tail(topPair);

    heap = th_remove(heap);
    return device;
}