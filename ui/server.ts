import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import { machines } from "../parser/parser";
import { heapInsert, heapExtractMin, resetHeap, heap } from "../lib/heap"; 
import { ClientData, initServerMemory, handleClientData } from "../src/clientDataManager";
import { ph_keys, ph_lookup } from "../lib/hashtables";
import { is_null, head, tail } from "../lib/list";

const PORT = 3000;
/*Helper function for heap visualisation tree, converts heap into JSON*/
function serializeHeap(node: any): any {
    if (!node) return null;

    return {
        key: node.key,
        device: node.data,
        left: serializeHeap(node.left_child),
        right: serializeHeap(node.right_child)
    };
}

/* --- Init empty Probing Hashtable --- */
const clientDataTable = initServerMemory(200);

/* --- Import fake vm's from JSON --- */
machines.forEach(vm => handleClientData(clientDataTable, vm));

/* --- Simulate vm behaviour --- */
function updateFakeVMs() {
    clientDataTable.forEach(vm => {
        vm.lastSeen += Math.floor(Math.random() * 5000);
        if(Math.random() < 0.2){
            vm.status = vm.status === "online" ? "offline" : "online";
        }
    });
}
setInterval(updateFakeVMs, 5000);

/* ---------------- SERVER ---------------- */
const server = http.createServer((req, res) => {

    if(req.url === "/"){
        const indexPath = path.join(__dirname, "index.html");

        if (fs.existsSync(indexPath)) {
            const html = fs.readFileSync(indexPath);
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(html);
        } else {
            res.writeHead(404);
            res.end("index.html not found");
        }
        return;
    }

    if (req.url === "/api/devices") {

        resetHeap();

        clientDataTable.forEach(device => {
            heapInsert(device);
        });

        const sortedDevices: ClientData[] = [];
        let device = heapExtractMin();

        while (device !== null) {
            sortedDevices.push(device);
            device = heapExtractMin();
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(sortedDevices));
        return;
    }

    /* ---------------- HEAP VISUALIZATION ---------------- */

    if (req.url === "/api/heap") {

        resetHeap();

        clientDataTable.forEach(device => {
            heapInsert(device);
        });

        const tree = serializeHeap(heap);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(tree));
        return;
    }

    /* ---------------- 404 ---------------- */

    res.writeHead(404);
    res.end("Not found");

});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});