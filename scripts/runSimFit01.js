import { SimulationKernel } from '../src/simulation/harness/SimulationKernel.js';
import { SIM_FIT_01 } from '../src/simulation/scenarios/SIM-FIT-01.js';
import { MetricCollector } from '../src/simulation/harness/MetricCollector.js';
import fs from 'fs';
import path from 'path';

async function runSimFit01() {
    console.log(`--- IRON INSTITUTIONAL SCIENCE: ${SIM_FIT_01.name} ---`);

    const sim = new SimulationKernel(SIM_FIT_01);
    const collector = new MetricCollector();

    // Patch SimulationKernel to use our collector (or update Kernel to accept one)
    const originalCapture = sim.recorder.capture.bind(sim.recorder);
    sim.recorder.capture = (day, event, snapshot, actorId) => {
        originalCapture(day, event, snapshot, actorId);
        collector.record(day, actorId, snapshot);
    };

    const startTime = Date.now();
    const { report, artifact } = await sim.runGenerative();
    const endTime = Date.now();

    const duration = (endTime - startTime) / 1000;
    console.log(`\n--- SIMULATION COMPLETE in ${duration}s ---`);

    // Export science artifacts
    const results = collector.generateArtifacts();
    const outputDir = path.join(process.cwd(), 'outputs');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    fs.writeFileSync(path.join(outputDir, 'standing_timelines.json'), JSON.stringify(results.standing_timelines, null, 2));
    fs.writeFileSync(path.join(outputDir, 'institutional_outcomes.json'), JSON.stringify(results.institutional_outcomes, null, 2));

    console.log(`\nINSTITUTIONAL HEALTH REPORT:`);
    console.log(`- Total Subjects: ${results.institutional_outcomes.length}`);

    const archetypes = Object.keys(SIM_FIT_01.archetypes);
    archetypes.forEach(arch => {
        const archStats = results.institutional_outcomes.filter(o => o.id.startsWith(arch));
        const archHealthy = archStats.filter(o => o.finalBand !== 'BREACHED' && o.finalBand !== 'VIOLATED').length;
        console.log(`  [${arch}] Survival: ${archHealthy}/${archStats.length}`);
    });

    process.exit(0);
}

runSimFit01().catch(console.error);
