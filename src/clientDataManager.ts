import { ProbingHashtable, hash_id, ph_empty, ph_insert, ph_lookup } from '../lib/hashtables';
import { List } from '../lib/list'

export type ClientData = {
    id: number;
    ip: string;
    gateway: string;
    os: string;
    user: string;
    lastSeen: number; // Timestamp for last seen.
    status: "online" | "offline" | undefined;
};

export type Machine = {
  ip: string
  subnet: Subnet
}

export type Subnet = {
  network: string;
  mask: number;
};

export type NmapService = {
  name?: string;
  product?: string;
  version?: string;
  extrainfo?: string;
};

export type NmapPort = {
  portid: number | string;
  protocol: string;
  state?: string | { state: string };
  service?: NmapService;
};

export type NmapHost = {
  addresses?: {
    ipv4?: string;
    ipv6?: string;
    mac?: string;
  };
  hostnames?: { name?: string; type?: string }[];
  ports?: NmapPort[];
  os?: {
    name?: string;
    accuracy?: string;
    osfamily?: string;
    osgen?: string;
  };
  traceroute?: {
    ttl?: number;
    ip?: string;
    rtt?: string;
  }[];
};

export type NmapScanEntry = {
  host?: NmapHost;
};

export type ParsedMachine = {
  ip: string;
  hostname?: string;
  os?: string;
  openPorts: {
    port: number;
    protocol: string;
    serviceName?: string;
    product?: string;
    version?: string;
  }[];
  hops: string[];
};

export type ClientTable = ProbingHashtable<number, ClientData>;

/**
 * Handle ClientData coming into server.
 * @param table Hashtable storing ClientData
 * @param clientData Incoming data from clients
 */
export function handleClientData(table: ClientTable, clientData: ClientData): void {
    
    // Check for client in table.
    const existingClient = ph_lookup(table, clientData.id);

    if (existingClient !== undefined) {
        existingClient.lastSeen = clientData.lastSeen;
    } else {
        // Client not in table, add client.
        ph_insert(table, clientData.id, clientData);
    }
}

//Create empty table for ClientData to be stored in.
export function initServerMemory(capacity: number): ClientTable {
    return ph_empty<number, ClientData>(capacity, hash_id); 
}