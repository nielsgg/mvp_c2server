"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.machines = void 0;
var fs = require("fs");
var path = require("path");
var data = fs.readFileSync(path.join(__dirname, "../data/scan.json"), "utf8");
var scan = JSON.parse(data);
// Create machine objects from scan.json
exports.machines = scan.map(function (host) { return ({
    ip: host.addresses.ipv4,
    subnet: {
        network: host.addresses.ipv4.split(".").slice(0, 3).join(".") + ".0",
        mask: 24
    }
}); });
console.log(exports.machines);
