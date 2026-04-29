/* 
Group Two 
CSCI 3300 
Dr. Porter 
Spring 2026 

data/localStorageManager.js 

Mackenzie 

Worker/server-safe data utilities only.


*/

// KEY 
const STORAGE_KEY = 'coursework_calculator_v1';

/* INITAL APP STATE */

// Create 
function createInitialAppState() {
  return {
    institutions: [],
    folders:      [],
    courses:      [],
    assignments:  [],
    alerts:       [],
    settings: {
      theme:              'light',
      defaultGPAScale:    '4.0',
      lastViewedFolderID: null,
    },
  };
};

// Launch
export function createInitialState() {
  return createInitialAppState();
}

// Serialize 
export function serializeState(state) {
  return JSON.stringify(state);
}

// Deserialize
export function deserializeState(raw) {
  try {
    return raw ? JSON.parse(raw) : createInitialAppState();
  } catch (err) {
    return createInitialAppState();
  }
}

/* STORAGE HELPERS */

// Save 
export function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, serializeState(state));
    return true;
  } catch (err) {
    return false;
  }
}

// Load
export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return deserializeState(raw);
  } catch (err) {
    return createInitialAppState();
  }
}

// Clear 
export function clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
}


/* IMPORT & EXPORT */

export function exportToJSON(state) {
  const blob    = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url     = URL.createObjectURL(blob);
  const link    = document.createElement('a');
  link.href     = url;
  link.download = `coursework-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function importFromJSON(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.name.endsWith('.json')) {
      reject(new Error('Please select a valid .json file!'));
      return;
    }
    const reader   = new FileReader();
    reader.onload  = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.courses || !Array.isArray(data.courses)) {
          reject(new Error('Invalid backup file: missing courses data'));
          return;
        }
        resolve(data);
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Sorry could not read file!'));
    reader.readAsText(file);
  });
}

