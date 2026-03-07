"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.heap = void 0;
exports.getPriorityKey = getPriorityKey;
exports.resetHeap = resetHeap;
exports.heapInsert = heapInsert;
exports.heapExtractMin = heapExtractMin;
var heaps_1 = require("./heaps");
var list_1 = require("./list");
exports.heap = (0, heaps_1.th_empty)();
// gives a penalty if offline and adds to lastseen
function getPriorityKey(device) {
    var statusWeight = device.status === "online" ? 0 : 1e14;
    return statusWeight + device.lastSeen;
}
// resets the heap so that we can create a new one
function resetHeap() {
    exports.heap = (0, heaps_1.th_empty)();
}
// Inserts device into heap with its priority and time, and keps smallest at top
function heapInsert(device) {
    var key = getPriorityKey(device);
    exports.heap = (0, heaps_1.th_insert)(exports.heap, key, device);
}
// Removes root node and restructures, resturns ClientData with smallest priority key
function heapExtractMin() {
    if ((0, heaps_1.th_is_empty)(exports.heap)) {
        return null;
    }
    var topPair = (0, heaps_1.th_top)(exports.heap);
    var device = (0, list_1.tail)(topPair);
    exports.heap = (0, heaps_1.th_remove)(exports.heap);
    return device;
}
