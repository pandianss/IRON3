/**
 * @typedef {Object} Scar
 * @property {string} id
 * @property {string} date
 * @property {string} type - 'FRACTURE' | 'RELAPSE'
 * @property {string} eraId - The Era this scar ended.
 */

export const Scars = {
    create: (type, date, eraId) => ({
        id: `SCAR_${Date.now()}`,
        type,
        date,
        eraId
    })
};
