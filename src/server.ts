import http from "http";
import fs from "fs";
import path from "path";

import { heapInsert, heapExtractMin, resetHeap, heap } from "../lib/heap";
import { ClientData } from "./clientDataManager";

const PORT = 3000;

/* ---------- SERIALIZE HEAP FOR VISUALIZER ---------- */

function serializeHeap(node: any): any {
    if (!node) return null;

    return {
        key: node.key,
        device: node.data,
        left: serializeHeap(node.left_child),
        right: serializeHeap(node.right_child)
    };
}

/* ---------- DEVICE TABLE ---------- */

const clientTable = new Map<number, ClientData>();

/* ---------- CREATE 15 FAKE VMs ---------- */

function randomIP(i: number) {
    return `192.168.1.${100 + i}`;
}

const fakeVMs: ClientData[] = [];

for (let i = 1; i <= 15; i++) {

    const vm: ClientData = {
        id: i,
        ip: randomIP(i),
        gateway: "192.168.1.1",
        os: ["Linux", "Windows 10", "Ubuntu", "macOS", "Debian"][i % 5]!,
        user: ["admin", "guest", "dev", "tester", "ops"][i % 5]!,

        lastSeen: Date.now() - Math.floor(Math.random() * 5000),

        status: Math.random() > 0.3 ? "online" : "offline"
    };

    fakeVMs.push(vm);
}

/* insert into hashtable */

fakeVMs.forEach(vm => clientTable.set(vm.id, vm));

/* ---------- SIMULATION LOOP ---------- */

function updateFakeVMs() {

    clientTable.forEach(vm => {

        vm.lastSeen = Date.now() - Math.floor(Math.random() * 3000);

        if (Math.random() < 0.08) {
            vm.status = vm.status === "online"
                ? "offline"
                : "online";
        }

    });

}

setInterval(updateFakeVMs, 2500);

/* ---------- SERVER ---------- */

const server = http.createServer((req, res) => {

    if (!req.url) return;

    /* ---------- ROOT PAGE ---------- */

    if (req.url === "/") {

        const indexPath = path.join(__dirname, "index.html");

        if (!fs.existsSync(indexPath)) {
            res.writeHead(404);
            res.end("index.html not found");
            return;
        }

        const html = fs.readFileSync(indexPath);

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);

        return;
    }

    /* ---------- DEVICE LIST ---------- */

    if (req.url === "/api/devices") {

        resetHeap();

        /* insert devices into heap */

        clientTable.forEach(device => {

            /* priority rule:
               online devices first
               then by lastSeen
            */

            heapInsert(device);

        });

        const sortedDevices: ClientData[] = [];

        let d = heapExtractMin();

        while (d !== null) {
            sortedDevices.push(d);
            d = heapExtractMin();
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(sortedDevices));

        return;
    }

    /* ---------- HEAP TREE ---------- */

    if (req.url === "/api/heap") {

        resetHeap();

        clientTable.forEach(device => {
            heapInsert(device);
        });

        const tree = serializeHeap(heap);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(tree));

        return;
    }

    /* ---------- 404 ---------- */

    res.writeHead(404);
    res.end("Not found");

});

/* ---------- START SERVER ---------- */

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});