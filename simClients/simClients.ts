import { ClientData, ClientTable, handleClientData, initServerMemory } from '../clientDataManager';

const simClients: Array<ClientData> = [
    // Node 1: Subnet router
    { id: 1, ip: "10.0.0.2", gateway: "192.168.1.10", os: "Windows 11", user: "admin", lastSeen: 1710000000000 },
    
    // Node 2, 3: Routing to node 1
    { id: 2, ip: "10.0.0.3", gateway: "10.0.0.2", os: "Ubuntu", user: "root", lastSeen: 1710000050000 },
    { id: 3, ip: "10.0.0.4", gateway: "10.0.0.2", os: "macOS", user: "dev", lastSeen: 1710000060000 },
    
    // Node 4: Node outside network
    { id: 4, ip: "10.0.0.5", gateway: "192.168.1.1", os: "Debian", user: "service_acc", lastSeen: 1710000020000 },
    
    // Node 5: Routing to node 4
    { id: 5, ip: "10.0.0.6", gateway: "10.0.0.5", os: "Windows 10", user: "hr_user", lastSeen: 1710000090000 }
];

//Function to add hardcoded ClientData in an array to server ClientTable
export function setupTestData(): ClientTable {
    // Create empty table for ClientData to be stored in
    const myTable = initServerMemory(50); 

    // For loop adding simClients elements one by one to server memory hashtable
    for (let i = 0; i < simClients.length; i++) {
        const client = simClients[i];
        handleClientData(myTable, client);
    };
    
    // Return hashtable
    return myTable;
}