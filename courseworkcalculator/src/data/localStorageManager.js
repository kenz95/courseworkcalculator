/* 
Group Two 
CSCI 3300 
Dr. Porter 
Spring 2026 

data/localStorageManager.js 

The local storage manager to create and load the save states from the User
Also allowing for import & export of: 
- JSON 


*/ 

// Import the Initial State from Models 
import { createInitialAppState } from "../models/index";

// Create a Global Constant Version Key 
const STORAGE_KEY = 'coursework_calculator_v1'; 

/* 

CREATE APP STATE 

*/ 


export function createInitialState() {
  return createInitialAppState();
}

/* 

SAVE APP STATE 

*/ 
export function serializeState(state) {
  return JSON.stringify(state);
}

/* 

CLEAR APP STATE 

*/ 

export function deserializeState(raw) {
  
    try {

        return raw ? JSON.parse(raw) : createInitialAppState();

  } catch (err) {


        return createInitialAppState();
  }
} 


/* 

EXPORT TO JSON 

*/ 

export function exportToJSON(state) {
  try {
    const blob    = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url     = URL.createObjectURL(blob);
    const link    = document.createElement('a');
    link.href     = url;
    link.download = `coursework-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('[Storage] Export failed:', err);
    return false;
  }
}


/* 

IMPORT TO JSON  

*/ 

export function importFromJSON(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.name.endsWith('.json')) {
      reject(new Error('Please select a valid .json file'));
      return;
    }
 
    const reader   = new FileReader();
    reader.onload  = (e) => {
      try {
        const data = JSON.parse(e.target.result);
 
        // Basic validation — check for expected structure
        if (!data.courses || !Array.isArray(data.courses)) {
          reject(new Error('Invalid backup file — missing courses data'));
          return;
        }
 
        resolve(data);
      } catch {
        reject(new Error('Invalid JSON file — could not parse'));
      }
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsText(file);
  });
}


