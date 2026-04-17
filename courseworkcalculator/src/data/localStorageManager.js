/* 
Group Two 
CSCI 3300 
Dr. Porter 
Spring 2026 

data/localStorageManager.js 

The local storage manager to create and load the save states from the User
Also allowing for import & export of: 
- JSON 

TO-DO: Add support for PDF, CSV, & TXT 

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

/* 

IMPORT TO JSON  

*/ 
