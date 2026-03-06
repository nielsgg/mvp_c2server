import http from "http";
import fs from "fs";
import path from "path";
// Import your new heap wrapper and the empty initializer
import { heapInsert, heapExtractMax, resetHeap } from "../lib/heap"; 
import { ClientData } from "./clientDataManager";

const PORT = 3000;

/* ---------------- BACKEND HASHTABLE ---------------- */
const clientTable = new Map<number, ClientData>();

/* ---------------- FAKE VMs ---------------- */
const fakeVMs: ClientData[] = [
    { id:1, ip:"192.168.1.10", gateway:"192.168.1.1", os:"Linux", user:"admin", lastSeen:5000, status:"online" },
    { id:2, ip:"192.168.1.11", gateway:"192.168.1.1", os:"Windows 10", user:"guest", lastSeen:12000, status:"offline" },
    { id:3, ip:"192.168.1.12", gateway:"192.168.1.1", os:"Ubuntu", user:"developer", lastSeen:8000, status:"online" },
    { id:4, ip:"192.168.1.13", gateway:"192.168.1.1", os:"macOS", user:"designer", lastSeen:15000, status:"offline" },
    { id:5, ip:"192.168.1.14", gateway:"192.168.1.1", os:"Linux", user:"tester", lastSeen:3000, status:"online" }
];

fakeVMs.forEach(vm => clientTable.set(vm.id, vm));

/* ---------------- SIMULATION ---------------- */
function updateFakeVMs() {
    clientTable.forEach(vm => {
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
        // Using path.join prevents issues with where you run the command from
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
        // 1. Clear the persistent heap by resetting the variable
        resetHeap(); 

        // 2. Insert devices into heap
        clientTable.forEach(device => {
            heapInsert(device);
        });

        // 3. Extract in priority order (Min-heap gives oldest lastSeen first)
        const sortedDevices: ClientData[] = [];
        let device = heapExtractMax();

        while (device !== null) {
            sortedDevices.push(device);
            device = heapExtractMax();
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(sortedDevices));
        return;
    }

    res.writeHead(404);
    res.end("Not found");
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});