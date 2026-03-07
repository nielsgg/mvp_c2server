import * as fs from "fs";
import * as path from "path";
import { Machine, ClientData } from "../src/clientDataManager";

//read file from resolved directory name where node process started + ../data/scan.json
const data = fs.readFileSync(
  path.join(__dirname, "../data/scan.json"),
  "utf8"
);
const scan = JSON.parse(data);

//create ClientData objects for dashboard
export const machines: ClientData[] = scan.map((host: any, i: number) => {

  const ipv4 = host.addresses?.ipv4;

  const os =
    host.os?.name ?? "unknown";

  const hostname =
    host.hostnames?.[0]?.name ?? "unknown";

  const status =
    host.status?.state === "up" ? "online" : "offline";

  const subnetNetwork = ipv4 ? ipv4.split(".").slice(0,3).join(".") + ".0" : "0.0.0.0";

  return {
    id: i,
    ip: ipv4,
    gateway: ipv4?.split(".").slice(0,3).join(".") + ".1",
    subnet: { network: subnetNetwork, mask: 24 },
    os,
    user: hostname,
    lastSeen: Date.now(),
    status
  };
});

console.log(machines);


