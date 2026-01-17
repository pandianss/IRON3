import { Standing, SovereignEvent } from '../../types';

export interface StandingFindings {
    standing?: Standing;
    streak?: number;
    entropy?: number;
    lastPracticeDate?: string;
}

export class StandingChamber {
    /**
     * Pure function to derive new standing findings from current state and event.
     */
    public static investigate(current: { state: Standing, streak: number, entropy: number, lastPracticeDate?: string }, event: SovereignEvent): StandingFindings | null {
        const type = event.type;
        const now = new Date(event.timestamp);

        switch (current.state) {
            case 'PRE_INDUCTION':
                if (type === 'CONTRACT_CREATED' || type === 'GENESIS_VERDICT_SUBMITTED') {
                    return { standing: 'INDUCTED', entropy: 0, streak: 0 };
                }
                break;

            case 'INDUCTED':
                if (['PRACTICE_COMPLETE', 'SESSION_ENDED', 'TRAINING_COMPLETED'].includes(type)) {
                    if (this.isSameDay(current.lastPracticeDate, now)) {
                        return { lastPracticeDate: now.toISOString() };
                    }
                    return { standing: 'COMPLIANT', entropy: 0, streak: 1, lastPracticeDate: now.toISOString() };
                }
                if (type === 'PRACTICE_MISSED' || type === 'SESSION_MISSED') {
                    return { standing: 'VIOLATED', entropy: 100, streak: 0 };
                }
                break;

            case 'COMPLIANT':
            case 'RECONSTITUTED':
            case 'INSTITUTIONAL':
                if (['PRACTICE_COMPLETE', 'SESSION_ENDED', 'TRAINING_COMPLETED'].includes(type)) {
                    if (this.isSameDay(current.lastPracticeDate, now)) {
                        return { lastPracticeDate: now.toISOString() };
                    }
                    const newStreak = current.streak + 1;
                    if (current.state === 'COMPLIANT' && newStreak >= 30) {
                        return { standing: 'INSTITUTIONAL', entropy: 0, streak: newStreak, lastPracticeDate: now.toISOString() };
                    }
                    return { streak: newStreak, entropy: 0, lastPracticeDate: now.toISOString() };
                }
                if (['REST_TAKEN', 'REST_OBSERVED', 'RECOVERY_COMPLETED'].includes(type)) {
                    return { entropy: 0 };
                }
                if (type === 'PRACTICE_MISSED' || type === 'SESSION_MISSED') {
                    return { standing: 'STRAINED', entropy: 50, streak: current.streak };
                }
                break;

            case 'STRAINED':
                if (['PRACTICE_COMPLETE', 'SESSION_ENDED'].includes(type)) {
                    return { standing: 'COMPLIANT', entropy: 0, streak: current.streak + 1 };
                }
                if (type === 'PRACTICE_MISSED') {
                    return { standing: 'VIOLATED', entropy: 100, streak: 0 };
                }
                break;

            case 'VIOLATED':
                if (type === 'ENTER_RECOVERY' || type === 'ACCEPT_RECOVERY') {
                    return { standing: 'RECOVERY', entropy: 50 };
                }
                break;

            case 'RECOVERY':
                if (['PRACTICE_COMPLETE', 'SESSION_ENDED'].includes(type)) {
                    const newStreak = current.streak + 1;
                    if (newStreak >= 3) {
                        return { standing: 'RECONSTITUTED', entropy: 0, streak: newStreak };
                    }
                    return { streak: newStreak, entropy: Math.max(0, current.entropy - 20) };
                }
                if (type === 'PRACTICE_MISSED') {
                    return { standing: 'VIOLATED', entropy: 100 };
                }
                break;
        }

        if (type === 'AUTHORITY_REALIGNED') {
            return { entropy: Math.min(100, current.entropy + 20) };
        }

        return null;
    }

    private static isSameDay(d1: string | undefined, d2: Date): boolean {
        if (!d1) return false;
        return new Date(d1).toDateString() === d2.toDateString();
    }
}
