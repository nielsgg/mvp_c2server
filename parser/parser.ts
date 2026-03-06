import * as fs from "fs";
import * as path from "path";
import { Machine, ClientData } from "../src/clientDataManager";

//read file from resolved directory name where node process started + ../data/scan.json
const data = fs.readFileSync(
  path.join(__dirname, "../data/scan.json"),
  "utf8"
);
const scan = JSON.parse(data);

// Create machine objects from scan.json
export const machines_for_lg: Machine[] = scan.map((host: any) => ({
  ip: host.addresses.ipv4,
  subnet: {
    network: host.addresses.ipv4.split(".").slice(0,3).join(".") + ".0",
    mask: 24
  }
}));

console.log(machines_for_lg);

//create ClientData objects for dashboard
export const machines: ClientData[] = scan.map((host: any, i: number) => {

  const ipv4 = host.addresses?.ipv4;

  const os =
    host.os?.name ?? "unknown";

  const hostname =
    host.hostnames?.[0]?.name ?? "unknown";

  const status =
    host.status?.state === "up" ? "online" : "offline";

  return {
    id: i,
    ip: ipv4,
    gateway: ipv4?.split(".").slice(0,3).join(".") + ".1",
    os,
    user: hostname,
    lastSeen: Date.now(),
    status
  };
});

console.log(machines);


