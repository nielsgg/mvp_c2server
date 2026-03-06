import { ProbingHashtable, hash_id, ph_empty, ph_insert, ph_lookup } from '../../lib/hashtables';

export type ClientData = {
    id: number;
    ip: string;
    gateway: string;
    os: string;
    user: string;
    lastSeen: number; // Timestamp for last seen.
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