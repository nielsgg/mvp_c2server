"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.machines = exports.machines_for_lg = void 0;
var fs = require("fs");
var path = require("path");
//read file from resolved directory name where node process started + ../data/scan.json
var data = fs.readFileSync(path.join(__dirname, "../data/scan.json"), "utf8");
var scan = JSON.parse(data);
// Create machine objects from scan.json
exports.machines_for_lg = scan.map(function (host) { return ({
    ip: host.addresses.ipv4,
    subnet: {
        network: host.addresses.ipv4.split(".").slice(0, 3).join(".") + ".0",
        mask: 24
    }
}); });
console.log(exports.machines_for_lg);
//create ClientData objects for dashboard
exports.machines = scan.map(function (host, i) {
    var _a, _b, _c, _d, _e, _f, _g;
    var ipv4 = (_a = host.addresses) === null || _a === void 0 ? void 0 : _a.ipv4;
    var os = (_c = (_b = host.os) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : "unknown";
    var hostname = (_f = (_e = (_d = host.hostnames) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.name) !== null && _f !== void 0 ? _f : "unknown";
    var status = ((_g = host.status) === null || _g === void 0 ? void 0 : _g.state) === "up" ? "online" : "offline";
    return {
        id: i,
        ip: ipv4,
        gateway: (ipv4 === null || ipv4 === void 0 ? void 0 : ipv4.split(".").slice(0, 3).join(".")) + ".1",
        os: os,
        user: hostname,
        lastSeen: Date.now(),
        status: status
    };
});
console.log(exports.machines);
