import * as fs from "fs";
import * as path from "path";
import { Machine } from "../src/clientDataManager";

//read file from resolved directory name where node process started + ../data/scan.json
const data = fs.readFileSync(
  path.join(__dirname, "../data/scan.json"),
  "utf8"
);
const scan = JSON.parse(data);

// Create machine objects from scan.json
export const machines: Machine[] = scan.map((host: any) => ({
  ip: host.addresses.ipv4,
  subnet: {
    network: host.addresses.ipv4.split(".").slice(0,3).join(".") + ".0",
    mask: 24
  }
}));

console.log(machines);


