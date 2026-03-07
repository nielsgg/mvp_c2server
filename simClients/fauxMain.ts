import { setupTestData } from './simClients'; 
import { ph_lookup } from '../lib/hashtables';

function main() {
    console.log("=== Loading test data into hashtable ===");

    const serverTable = setupTestData();
    console.log("Testdata loaded!\n");

    console.log("\n--- Inspect memory ---");
    console.dir(serverTable, { depth: null, colors: true });
}

main();