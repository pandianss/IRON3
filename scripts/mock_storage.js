/**
 * mock_storage.js
 * Mocks localStorage for Node.js environment.
 */
let mockStorage = {};
global.localStorage = {
    setItem: (key, val) => { mockStorage[key] = val; },
    getItem: (key) => mockStorage[key] || null,
    clear: () => { mockStorage = {}; },
    removeItem: (key) => { delete mockStorage[key]; }
};
console.log("MOCK: localStorage initialized.");
