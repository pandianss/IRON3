
import { SimulationKernel } from './simulation/harness/SimulationKernel.js';

async function runYearSim() {
    console.log("--- IRON INSTITUTIONAL SCIENCE: 100 USER YEAR RUN ---");

    const sim = new SimulationKernel();

    // 100 Users, Balanced Archetypes
    const actors = [];
    for (let i = 0; i < 25; i++) actors.push({ id: `IRON_WILL_${i}`, archetype: 'IRON_WILL' });
    for (let i = 0; i < 25; i++) actors.push({ id: `CONSISTENT_${i}`, archetype: 'CONSISTENT' });
    for (let i = 0; i < 25; i++) actors.push({ id: `STRUGGLING_${i}`, archetype: 'STRUGGLING' });
    for (let i = 0; i < 25; i++) actors.push({ id: `TOURIST_${i}`, archetype: 'TOURIST' });

    const startTime = Date.now();

    const { report, artifact } = await sim.runGenerative({
        days: 365,
        actors
    });

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log(`\n--- SIMULATION COMPLETE in ${duration}s ---`);

    // 2. Statistical Analysis
    const total = artifact.summary.length;
    const survived = artifact.summary.filter(s => s.finalPhase.id === 'ACTIVE' && s.finalState.state !== 'VIOLATED').length;
    const active = artifact.summary.filter(s => s.finalPhase.id === 'ACTIVE').length;
    const stillProbation = artifact.summary.filter(s => s.finalPhase.id === 'PROBATION').length;

    console.log("\nINSTITUTIONAL HEALTH REPORT:");
    console.log(`- Total Subjects: ${total}`);
    console.log(`- Active Institutions: ${active}`);
    console.log(`- Healthy Survived: ${survived} (${Math.round(survived / total * 100)}%)`);
    console.log(`- Never Graduated (Stuck in Probation): ${stillProbation}`);

    // Break down by archetype
    const archetypes = ['IRON_WILL', 'CONSISTENT', 'STRUGGLING', 'TOURIST'];
    archetypes.forEach(arch => {
        const archStats = artifact.summary.filter(s => s.id.startsWith(arch));
        const archHealthy = archStats.filter(s => s.finalState.state !== 'VIOLATED' && s.finalPhase.id === 'ACTIVE').length;
        console.log(`  [${arch}] Survival: ${archHealthy}/${archStats.length}`);
    });

    process.exit(0);
}

runYearSim().catch(console.error);
