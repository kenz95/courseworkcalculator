/* 
Group Two 
CSCI 3300 
Dr. Porter 
Spring 2026 

data/localStorageManager.js 

Mackenzie 

The local storage manager to create and load the save states from the User
Also allowing for import & export JSON 

*/

const STORAGE_KEY = 'coursework_calculator_v1';

export function createInitialState() {
  return {
    institutions: [],
    folders: [],
    courses: [],
    assignments: [],
    alerts: [],
    settings: {
      theme: 'light',
      defaultGpaScale: '4.0',
      lastViewedFolderId: null,
    }
  };
}

export function serializeState(state) {
  return JSON.stringify(state);
}

export function deserializeState(raw) {
  try {
    return raw ? JSON.parse(raw) : createInitialState();
  } catch (err) {
    return createInitialState();
  }
}

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
    const reader   = new FileReader();
    reader.onload  = (e) => {
      try { resolve(JSON.parse(e.target.result)); }
      catch { reject(new Error('Invalid JSON file')); }
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsText(file);
  });
}