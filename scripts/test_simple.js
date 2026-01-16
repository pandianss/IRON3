/**
 * test_simple.js
 */
import './mock_storage.js';
console.log("Mock Storage Loaded.");
import { InstitutionalKernel } from '../src/ice/Kernel.js';
console.log("Institutional Kernel Imported.");
const kernel = new InstitutionalKernel();
console.log("Institutional Kernel Initialized.");

async function run() {
    console.log("Ingesting event...");
    await kernel.ingest('GENESIS_VERDICT_SUBMITTED', { why: 'Verification Plan' }, 'User');
    console.log("Ingestion Complete.");
}

run().catch(console.error);
