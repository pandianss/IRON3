import { InstitutionalKernel } from '../../ice/Kernel.js';

/**
 * Harness Module: Institutional Interface
 * Role: Strict Adapter. The only legal bridge between Harness and ICE.
 * Ensures ICE is treated as a black box.
 */
export class InstitutionalInterface {
    constructor(scenario = {}) {
        this.ice = new InstitutionalKernel({ scenario });
        console.log("HARNESS: ICE Booted.");
    }

    /**
     * Injects a raw simulation event into ICE.
     * @param {object} event - { rule, payload, actorId }
     */
    async inject(event) {
        // Here we could add simulated network latency or failures
        return await this.ice.ingest(event.type, event.payload, event.actorId);
    }

    getSnapshot() {
        return this.ice.getSnapshot();
    }
}
