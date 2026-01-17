/**
 * Institutional Health Report Artifact
 * Compiles the constitutional history of an institution into a portable artifact.
 */
import fs from 'fs';
import path from 'path';

export class InstitutionHealthReport {
    constructor(kernel) {
        this.kernel = kernel;
    }

    generate() {
        const snapshot = this.kernel.getSnapshot();
        const monitor = this.kernel.getMonitor();
        const state = monitor.getState();

        return {
            artifactType: "INSTITUTIONAL_HEALTH_REPORT",
            version: "1.0.0",
            timestamp: new Date().toISOString(),
            institution: {
                stage: state?.lifecycle?.stage || 'UNKNOWN',
                activatedAt: state?.lifecycle?.activatedAt,
                purpose: state?.foundation?.why
            },
            constitution: {
                principlesLoaded: snapshot.principles?.length || 0,
                activeInvariants: snapshot.invariants?.length || 0
            },
            health: {
                current: monitor.getHealthScore(),
                timeline: snapshot.healthTimeline || []
            },
            audit: {
                totalDecisions: snapshot.audit?.length || 0,
                violations: (snapshot.audit || []).filter(a => !a.allowed)
            },
            verdict: this.deriveFinalVerdict(state)
        };
    }

    deriveFinalVerdict(state) {
        const stage = state?.lifecycle?.stage;
        if (stage === 'COLLAPSED') return 'FAILURE';
        if (stage === 'SUSPENDED') return 'SANCTIONED';
        if (stage === 'ACTIVE') return 'SUCCESS';
        return 'INCONCLUSIVE';
    }

    exportToFile(outputPath) {
        const report = this.generate();
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
        console.log(`KERNEL: Institutional Health Report exported to ${outputPath}`);
        return outputPath;
    }
}
