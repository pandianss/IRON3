import { InstitutionalKernel } from '../../ice/InstitutionalKernel.js';

/**
 * NEW Simulation Harness
 * Role: Orchestrate generative institutional runs.
 */
export class SimulationKernel {
    constructor(scenario) {
        this.scenario = scenario;
        this.kernel = new InstitutionalKernel({ scenario });
        this.recorder = {
            capture: (day, event, snapshot, actorId) => {
                // This will be wrapped/intercepted in runSimFit03.js
            }
        };
    }

    async runGenerative() {
        console.log(`SIM: Starting generative run for ${this.scenario.days} days.`);

        // 1. Initial Activation
        // Note: The InstitutionalKernel.ingest() already calls complianceKernel.getGate().govern()
        // However, we want to ensure ACTIVATE_INSTITUTION is handled.
        await this.kernel.ingest('ACTIVATE_INSTITUTION', {
            health: this.scenario.initialHealth || 100,
            foundation: this.scenario.foundation || { why: "Simulation Purpose" }
        }, "SimulationHarness");

        for (let day = 1; day <= this.scenario.days; day++) {
            // 2. Daily Pulse
            await this.kernel.ingest('DAILY_PULSE', { day }, "System");

            // 3. Weekly Cycle (every 7 days)
            if (day % 7 === 0) {
                await this.kernel.ingest('WEEKLY_CYCLE', { week: day / 7 }, "System");
            }

            // 4. Capture state for recording
            const snapshot = this.kernel.getSnapshot();
            this.recorder.capture(day, 'SNAPSHOT', snapshot, "System");

            // Check for collapse/termination
            if (snapshot.state.lifecycle?.stage === 'COLLAPSED') {
                console.warn(`SIM: Institution COLLAPSED on day ${day}. Terminating simulation.`);
                break;
            }
        }
    }
}
