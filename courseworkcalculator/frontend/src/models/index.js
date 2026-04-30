/* 
Group Two 
CSCI 3300 
Dr. Porter 
Spring 2026 

Mackenzie 

models/index.js 

Core data modesl for the Coursework tracekr & GPA Calculator 

Using Plain JS Objects 

*/ 

import { v4 as uuidv4 } from 'uuid';

/* FOLDERS */

export function createFolder(overrides = {}) {
  return {
    id: uuidv4(),
    name: '',
    institutionID: null,
     gradeScale: [
      { min: 93, points: 4.0, letter: "A"  },
      { min: 90, points: 3.7, letter: "A-" },
      { min: 87, points: 3.3, letter: "B+" },
      { min: 83, points: 3.0, letter: "B"  },
      { min: 80, points: 2.7, letter: "B-" },
      { min: 77, points: 2.3, letter: "C+" },
      { min: 73, points: 2.0, letter: "C"  },
      { min: 70, points: 1.7, letter: "C-" },
      { min: 67, points: 1.3, letter: "D+" },
      { min: 63, points: 1.0, letter: "D"  },
      { min: 60, points: 0.7, letter: "D-" },
      { min: 0,  points: 0.0, letter: "F"  },
    ],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

/* COURSES */

export function createCourse(overrides = {}) {
  return {
    id: uuidv4(),
    folderID: null,
    institutionID: null,
    name: '',
    creditHours: 3,
    color: '#6366f1',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

/* ASSIGNMENTS */

export function createAssignment(overrides = {}) {
  return {
    id: uuidv4(),
    courseID: null,
    name: '',
    category: '',
    weight: 0,
    grade: null,
    dueDate: null,
    notes: '',
    isDropped: false,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
  
}

/* ALERTS */ 
export function createAlert(overrides = {}) {
  return {
    id:          uuidv4(),
    type:        'warning',     // 'warning' | 'error' | 'info' | 'success'
    message:     '',
    courseID:    null,
    isDismissed: false,
    createdAt:   new Date().toISOString(),
    ...overrides,
  };
}

/* INSTITUTIONS */ 
export function createInstitution(overrides = {}) {
  return {
    id:        uuidv4(),
    name:      '',
    gradeScale: [
      { min: 93, points: 4.0, letter: "A"  },
      { min: 90, points: 3.7, letter: "A-" },
      { min: 87, points: 3.3, letter: "B+" },
      { min: 83, points: 3.0, letter: "B"  },
      { min: 80, points: 2.7, letter: "B-" },
      { min: 77, points: 2.3, letter: "C+" },
      { min: 73, points: 2.0, letter: "C"  },
      { min: 70, points: 1.7, letter: "C-" },
      { min: 67, points: 1.3, letter: "D+" },
      { min: 63, points: 1.0, letter: "D"  },
      { min: 60, points: 0.7, letter: "D-" },
      { min: 0,  points: 0.0, letter: "F"  },
    ],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}