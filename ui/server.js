"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var fs = require("fs");
var path = require("path");
var parser_1 = require("../parser/parser");
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime"
// Import your new heap wrapper and the empty initializer
var heap_1 = require("../lib/heap");
var PORT = 3000;
/*Helper function for heap visualisation tree, converts heap into JSON*/
function serializeHeap(node) {
    if (!node)
        return null;
    return {
        key: node.key,
        device: node.data,
        left: serializeHeap(node.left_child),
        right: serializeHeap(node.right_child)
    };
}
/* ---------------- BACKEND HASHTABLE ---------------- */
var clientTable = new Map();
/* ---------------- FAKE VMs ---------------- */
var fakeVMs = [
    { id: 1, ip: "192.168.1.10", gateway: "192.168.1.1", os: "Linux", user: "admin", lastSeen: 5000, status: "online" },
    { id: 2, ip: "192.168.1.11", gateway: "192.168.1.1", os: "Windows 10", user: "guest", lastSeen: 12000, status: "offline" },
    { id: 3, ip: "192.168.1.12", gateway: "192.168.1.1", os: "Ubuntu", user: "developer", lastSeen: 8000, status: "online" },
    { id: 4, ip: "192.168.1.13", gateway: "192.168.1.1", os: "macOS", user: "designer", lastSeen: 15000, status: "offline" },
    { id: 5, ip: "192.168.1.14", gateway: "192.168.1.1", os: "Linux", user: "tester", lastSeen: 3000, status: "online" }
];
//
/* ---------------- FAKE VMs from JSON ---------------- */
parser_1.machines;
fakeVMs.forEach(function (vm) { return clientTable.set(vm.id, vm); });
/* ---------------- SIMULATION ---------------- */
function updateFakeVMs() {
    clientTable.forEach(function (vm) {
        vm.lastSeen += Math.floor(Math.random() * 5000);
        if (Math.random() < 0.2) {
            vm.status = vm.status === "online" ? "offline" : "online";
        }
    });
}
setInterval(updateFakeVMs, 5000);
/* ---------------- SERVER ---------------- */
var server = http.createServer(function (req, res) {
    if (req.url === "/") {
        var indexPath = path.join(__dirname, "index.html");
        if (fs.existsSync(indexPath)) {
            var html = fs.readFileSync(indexPath);
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        }
        else {
            res.writeHead(404);
            res.end("index.html not found");
        }
        return;
    }
    if (req.url === "/api/devices") {
        (0, heap_1.resetHeap)();
        clientTable.forEach(function (device) {
            (0, heap_1.heapInsert)(device);
        });
        var sortedDevices = [];
        var device = (0, heap_1.heapExtractMin)();
        while (device !== null) {
            sortedDevices.push(device);
            device = (0, heap_1.heapExtractMin)();
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(sortedDevices));
        return;
    }
    /* ---------------- HEAP VISUALIZATION ---------------- */
    if (req.url === "/api/heap") {
        (0, heap_1.resetHeap)();
        clientTable.forEach(function (device) {
            (0, heap_1.heapInsert)(device);
        });
        var tree = serializeHeap(heap_1.heap);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(tree));
        return;
    }
    /* ---------------- 404 ---------------- */
    res.writeHead(404);
    res.end("Not found");
});
server.listen(PORT, function () {
    console.log("Server running at http://localhost:".concat(PORT));
});
