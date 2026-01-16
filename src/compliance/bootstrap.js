import { ConstitutionalKernel } from './kernel/ConstitutionalKernel.js';

let kernelInstance = null;

export async function initializeKernel(institutionalKernel) {
    if (kernelInstance) return kernelInstance;

    console.log("COMPLIANCE: Starting Constitutional Bootstrap...");

    const kernel = new ConstitutionalKernel();
    kernel.initialize({}, institutionalKernel);

    kernelInstance = kernel;
    console.log("COMPLIANCE: Bootstrap Complete. Kernel Sovereign.");
    return kernel;
}

export function getKernel() {
    if (!kernelInstance) {
        throw new Error("Sovereignty Breach: Kernel not initialized. Call initializeKernel() first.");
    }
    return kernelInstance;
}
