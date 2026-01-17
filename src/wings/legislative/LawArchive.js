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
            if (!raw) return {};
            return JSON.parse(raw);
        } catch (e) {
            console.error("LAW_ARCHIVE: Failed to load laws.", e);
            return {};
        }
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
