import type {ClientData} from "../src/clientDataManager";

export let heap: ClientData[] = [];

export function getPriority(device: ClientData): number {
    const priority: number = Date.now() - device.lastSeen;
    return priority;
}

// Inserts device into heap
export function heapInsert(device: ClientData): void {
    heap.push(device);

    let i: number = heap.length - 1;

    while (i > 0) {
        let parentIndex: number = Math.floor((i - 1) / 2);

        let child: ClientData = heap[i];
        let parent: ClientData = heap[parentIndex];

        if (getPriority(child) <= getPriority(parent)) break;

        heap[i] = parent;
        heap[parentIndex] = child;

        i = parentIndex;
    }   
}

// Removes the gighest priority device
export function heapExtractMax(): ClientData | null {
    if (heap.length === 0) {
        return null;
    }
    let max: ClientData = heap[0];

    let last: ClientData | undefined = heap.pop();

    if (heap.length === 0 || last === undefined) {
        return max;
    }

    heap[0] = last;

    let i: number = 0

    while (true) {

        let leftIndex: number = 2 * i + 1;
        let rightIndex: number = 2 * i + 2;
        let largestIndex: number = i;

        if (leftIndex < heap.length &&
            getPriority(heap[leftIndex]) > getPriority(heap[largestIndex])
        ) {
            largestIndex = leftIndex;
        }

        if ( rightIndex < heap.length &&
            getPriority(heap[rightIndex]) > getPriority(heap[largestIndex])
        ) { largestIndex = rightIndex;

        }
        
        if (largestIndex === i){
            break;
        }

        let temp: ClientData = heap[i];
        heap[i] = heap[largestIndex];
        heap[largestIndex] = temp;

        i = largestIndex;
   }

   return max;
}