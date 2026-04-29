/*
Group Two
CSCI 3300
Dr. Porter
Spring 2026

Mackenzie 

src/data/apiService.js
Connects the React frontend to the Cloudflare Worker API

*/

const API_BASE = import.meta.env.VITE_API_URL || 'https://courseworkcalculator.mmjohn3601.workers.dev';

// COURSE AVERAGE 
export async function fetchCourseAverage(assignments) {
  const res = await fetch(`${API_BASE}/api/course-average`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assignments }),
  });
  if (!res.ok) throw new Error('Failed to calculate course average');
  return res.json();
}

// TARGET GRADE SIMULATION 
export async function fetchTargetGrade(current, finalWeight, target) {
  const res = await fetch(`${API_BASE}/api/target-grade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ current, finalWeight, target }),
  });
  if (!res.ok) throw new Error('Failed to run simulation');
  return res.json();
}

// GET COURSES 
export async function fetchCourses() {
  const res = await fetch(`${API_BASE}/courses`);
  if (!res.ok) throw new Error('Failed to fetch courses');
  return res.json();
}

// GET ASSIGNMENTS 
export async function fetchAssignments() {
  const res = await fetch(`${API_BASE}/assignments`);
  if (!res.ok) throw new Error('Failed to fetch assignments');
  return res.json();
}

// HEALTH CHECK
export async function checkAPIStatus() {
  try {
    const res = await fetch(`${API_BASE}/`);
    return res.ok;
  } catch {
    return false;
  }
}