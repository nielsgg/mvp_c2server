"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleClientData = handleClientData;
exports.initServerMemory = initServerMemory;
var hashtables_1 = require("../../lib/hashtables");
/**
 * Handle ClientData coming into server.
 * @param table Hashtable storing ClientData
 * @param clientData Incoming data from clients
 */
function handleClientData(table, clientData) {
    // Check for client in table.
    var existingClient = (0, hashtables_1.ph_lookup)(table, clientData.id);
    if (existingClient !== undefined) {
        existingClient.lastSeen = clientData.lastSeen;
    }
    else {
        // Client not in table, add client.
        (0, hashtables_1.ph_insert)(table, clientData.id, clientData);
    }
}
//Create empty table for ClientData to be stored in.
function initServerMemory(capacity) {
    return (0, hashtables_1.ph_empty)(capacity, hashtables_1.hash_id);
}
