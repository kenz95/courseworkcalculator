/* 
Group Two 
CSCI 3300 
Dr. Porter 
Spring 2026 

data/localStorageManager.js 

Mackenzie 

Worker/server-safe data utilities only.


*/

// Import all packages 
import { createInitialAppState } from '../models/index.js';

// Create inital state 
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
