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
