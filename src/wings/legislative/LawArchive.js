/**
 * LAW ARCHIVE
 * 
 * The persistent storage layer for Private Sovereign Laws.
 * Handles the saving, loading, and deletion of custom protocols.
 * 
 * Storage Key: 'IRON_PRIVATE_LAWS'
 */

const STORAGE_KEY = 'IRON_PRIVATE_LAWS';

export const LawArchive = {

    /**
     * Load all private laws from persistence.
     * @returns {Object} Dictionary of protocols by ID.
     */
    loadLaws: () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            let laws = {};

            if (raw) {
                laws = JSON.parse(raw);
            }

            // AUTO-SEED: Ensure defaults exist even if DB is not empty
            // This fixes the issue where new system protocols don't appear for existing users
            const defaults = LawArchive.getDefaults();
            let dirty = false;

            Object.keys(defaults).forEach(key => {
                if (!laws[key]) {
                    laws[key] = defaults[key];
                    dirty = true;
                }
            });

            if (dirty) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(laws));
                console.log("LAW_ARCHIVE: Surgical Seed Complete (Missing defaults injected).");
            }

            return laws;
        } catch (e) {
            console.error("LAW_ARCHIVE: Failed to load laws.", e);
            return {};
        }
    },

    getDefaults: () => {
        return {
            'LAW_MIN_DAILY_FITNESS': {
                id: 'LAW_MIN_DAILY_FITNESS',
                label: 'MINIMUM DAILY FITNESS',
                description: 'Mandatory physical obligation.',
                domain: 'BIO_REGIME',
                userCount: 1,
                primaryMetric: 'COMPLETE',
                ratifiedAt: Date.now(),
                isCustom: true,
                focus: 'Complete before noon. Failure triggers escalation.',

                // Advanced Protocol Logic (Graph Simulation)
                trigger: {
                    type: 'TIME',
                    value: '07:00',
                    reminders: [
                        { time: '12:00', message: 'COMMITMENT INCOMPLETE' },
                        { time: '16:00', message: 'FAILURE IMMINENT: ESCALATION' }
                    ]
                },
                requirements: [
                    { id: 'c1', type: 'PHOTO', label: 'Before Workout Selfie', timestamp: true },
                    { id: 'c2', type: 'GPS', label: 'Gym Location Check', timestamp: true },
                    { id: 'c3', type: 'PHOTO', label: 'After Workout Selfie', timestamp: true },
                    { id: 'c4', type: 'TAGS', label: 'Session Tags', allowCustom: true }
                ]
            }
        };
    },

    seedDefaults: () => {
        const defaults = LawArchive.getDefaults();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
        return defaults;
    },

    /**
     * Save a protocol to the archive.
     * @param {Object} protocol - The protocol object to save.
     * @returns {boolean} Success status.
     */
    saveLaw: (protocol) => {
        if (!protocol || !protocol.id) {
            console.error("LAW_ARCHIVE: Cannot save invalid law.", protocol);
            return false;
        }

        try {
            const currentLaws = LawArchive.loadLaws();

            // Enforce Sovereign Metadata
            const lawToSave = {
                ...protocol,
                isCustom: true,
                ratifiedAt: Date.now(),
                domain: protocol.domain || 'SYSTEM_LOGISTICS'
            };

            currentLaws[protocol.id] = lawToSave;

            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentLaws));
            console.log(`LAW_ARCHIVE: Ratified ${protocol.id}`);
            return true;
        } catch (e) {
            console.error("LAW_ARCHIVE: Failed to save law.", e);
            return false;
        }
    },

    /**
     * Delete a protocol from the archive.
     * @param {string} id - The ID of the protocol to repeal.
     */
    repealLaw: (id) => {
        try {
            const currentLaws = LawArchive.loadLaws();
            if (currentLaws[id]) {
                delete currentLaws[id];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(currentLaws));
                console.log(`LAW_ARCHIVE: Repealed ${id}`);
                return true;
            }
            return false;
        } catch (e) {
            console.error("LAW_ARCHIVE: Failed to repeal law.", e);
            return false;
        }
    },

    /**
     * Clear all private laws. (Debug/Reset)
     */
    burnArchive: () => {
        localStorage.removeItem(STORAGE_KEY);
        console.warn("LAW_ARCHIVE: Library burned.");
    }
};
