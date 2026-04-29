/* 
Group Two 
CSCI 3300 
Dr. Porter 
Spring 2026 

models/index.js 

Core data modesl for the Coursework tracekr & GPA Calculator 

Using Plain JS Objects 
Mirroring the SQL Tables

Mackenzie 

*/ 

import { v4 as uuidv4 } from 'uuid';

export function createFolder(overrides = {}) {
  return {
    id: uuidv4(),
    name: '',
    institutionID: null,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

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