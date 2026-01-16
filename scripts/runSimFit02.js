import { SimulationKernel } from '../src/simulation/harness/SimulationKernel.js';
import { SIM_FIT_02 } from '../src/simulation/scenarios/SIM-FIT-02.js';
import { MetricCollector } from '../src/simulation/harness/MetricCollector.js';
import fs from 'fs';
import path from 'path';

async function run() {
    console.log(`--- IRON INSTITUTIONAL SCIENCE: ${SIM_FIT_02.name} ---`);
    const sim = new SimulationKernel(SIM_FIT_02);
    const collector = new MetricCollector();

    const originalCapture = sim.recorder.capture.bind(sim.recorder);
    sim.recorder.capture = (day, event, snapshot, actorId) => {
        originalCapture(day, event, snapshot, actorId);
        collector.record(day, actorId, snapshot);
    };

    const startTime = Date.now();
    await sim.runGenerative();
    const endTime = Date.now();

    console.log(`\n--- SIMULATION COMPLETE in ${(endTime - startTime) / 1000}s ---`);

    const results = collector.generateArtifacts();
    const outputDir = path.join(process.cwd(), 'outputs', 'SIM-FIT-02');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    fs.writeFileSync(path.join(outputDir, 'standing_timelines.json'), JSON.stringify(results.standing_timelines, null, 2));
    fs.writeFileSync(path.join(outputDir, 'institutional_outcomes.json'), JSON.stringify(results.institutional_outcomes, null, 2));

    console.log(`\nINSTITUTIONAL HEALTH REPORT:`);
    const archetypes = Object.keys(SIM_FIT_02.archetypes);
    archetypes.forEach(arch => {
        const archStats = results.institutional_outcomes.filter(o => o.id.startsWith(arch));
        const archHealthy = archStats.filter(o => o.finalBand === 'ASCENDING' || o.finalBand === 'STABLE').length;
        console.log(`  [${arch}] Survival: ${archHealthy}/${archStats.length}`);
    });
}

run().catch(console.error);
