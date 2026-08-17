// In-memory store so tests can set and read values
const store = {};

const getItem = jest.fn((key) => Promise.resolve(store[key] ?? null));
const setItem = jest.fn((key, value) => { store[key] = value; return Promise.resolve(); });
const removeItem = jest.fn((key) => { delete store[key]; return Promise.resolve(); });
const clear = jest.fn(() => { Object.keys(store).forEach(k => delete store[k]); return Promise.resolve(); });
const getAllKeys = jest.fn(() => Promise.resolve(Object.keys(store)));
const multiGet = jest.fn((keys) => Promise.resolve(keys.map(k => [k, store[k] ?? null])));

// Expose store so tests can pre-populate it: AsyncStorage.__store
const __setStore = (key, value) => { store[key] = value; };
const __clearStore = () => { Object.keys(store).forEach(k => delete store[k]); };

module.exports = {
  getItem,
  setItem,
  removeItem,
  clear,
  getAllKeys,
  multiGet,
  __setStore,
  __clearStore,
};
