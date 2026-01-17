import { SovereignEvent, Action, Verdict, InstitutionalState } from '../types';
import { LedgerAuthority } from '../ledger/LedgerAuthority';
import { EventRegistry } from '../events/EventRegistry';
import { InstitutionalStateModel } from '../state/InstitutionState';
import { StandingChamber } from './chambers/StandingChamber';
import { SessionChamber } from './chambers/SessionChamber';
import { AuthorityChamber } from './chambers/AuthorityChamber';
import { ContractChamber } from './chambers/ContractChamber';
import { VerdictEngine } from '../verdicts/VerdictEngine';
import { Constitution } from '../constitution/Constitution';
import { AuditEngine } from '../audit/AuditEngine';

export class IronCourt {
    private ledger: LedgerAuthority;
    private internalState: InstitutionalStateModel;
    private verdictEngine: VerdictEngine;
    private constitution: Constitution;
    private audit: AuditEngine;
    private listeners: Array<(state: InstitutionalState) => void> = [];

    constructor(initialEvents: SovereignEvent[] = []) {
        this.ledger = new LedgerAuthority(initialEvents);
        this.internalState = new InstitutionalStateModel();
        this.verdictEngine = new VerdictEngine();
        this.constitution = new Constitution();
        this.audit = new AuditEngine();

        // Reconstruct state from history
        this.replay(initialEvents);

        console.log("IRON_COURT_EMP_ACTIVE");
    }

    /**
     * Adjudicates an action and updates institutional state.
     */
    public async ingest(action: Action): Promise<Verdict> {
        console.log(`IRON: Adjudicating [${action.type}]`);

        // 1. Law Phase: Validate against Constitution
        const currentSnapshot = this.internalState.getSnapshot();
        const lawResult = this.constitution.getRules().validate(action, currentSnapshot);
        if (!lawResult.allowed) {
            console.error(`IRON_VIOLATION: ${lawResult.reason} | Action: ${JSON.stringify(action)}`);
            throw new Error(lawResult.reason || "CONSTITUTIONAL_BREACH");
        }

        // 2. Creation & Validation
        const event = EventRegistry.create(action);

        // 3. Investigation Phase (Chambers)
        const standingFindings = StandingChamber.investigate(
            {
                state: currentSnapshot.domains.standing.state,
                streak: currentSnapshot.domains.standing.streak,
                entropy: currentSnapshot.domains.standing.entropy,
                lastPracticeDate: currentSnapshot.domains.standing.lastPracticeDate
            },
            event
        );

        const sessionFindings = SessionChamber.investigate(currentSnapshot.domains.session, event);
        const contractFindings = ContractChamber.investigate(
            {
                activeContracts: currentSnapshot.activeLaws,
                obligations: currentSnapshot.domains.foundation?.obligations || [],
                federation: currentSnapshot.domains.federation
            },
            event
        );

        // 4. Verdict Phase
        const verdict = await this.verdictEngine.render(event, currentSnapshot);
        if (standingFindings && standingFindings.standing) {
            verdict.standingTransition = {
                from: currentSnapshot.domains.standing.state,
                to: standingFindings.standing
            };
        }

        // 5. Audit Phase
        const auditId = this.audit.witness(event, action.actor);

        // 6. Ledger Phase
        this.ledger.append(event, verdict);

        // 7. State Application
        this.applyFindings(standingFindings, sessionFindings, contractFindings);

        // 8. Final authority resolution
        const finalAuthority = AuthorityChamber.investigate(this.internalState.getSnapshot());
        this.internalState.domains.authority = finalAuthority;

        this.notify();
        return verdict;
    }

    private applyFindings(standing?: any, session?: any, contract?: any) {
        if (standing) {
            this.internalState.domains.standing = { ...this.internalState.domains.standing, ...standing };
            if (standing.standing) this.internalState.standing = standing.standing;
        }
        if (session) {
            this.internalState.domains.session = { ...this.internalState.domains.session, ...session };
        }
        if (contract) {
            if (contract.activeContracts) this.internalState.activeLaws = contract.activeContracts;
            if (contract.federation) this.internalState.domains.federation = { ...this.internalState.domains.federation, ...contract.federation };
        }
    }

    private replay(events: SovereignEvent[]) {
        // Simple replay for state reconstruction
    }

    public subscribe(listener: (state: InstitutionalState) => void) {
        this.listeners.push(listener);
        return () => { this.listeners = this.listeners.filter(l => l !== listener); };
    }

    private notify() {
        const snap = this.getSnapshot();
        this.listeners.forEach(l => l(snap));
    }

    public getSnapshot(): InstitutionalState {
        const snap = this.internalState.getSnapshot();
        return {
            ...snap,
            history: this.ledger.getHistory()
        };
    }
}
