/* 
Group Two 
CSCI 3300 
Dr. Porter 
Spring 2026 

Mackenzie 

src/worker.js 
Cloudflare Worker — Backend API for Coursework Tracker & GPA Calculator


*/

import { createCourse, createAssignment } from './models/index.js';
import { calculateCourseAverage } from './logic/gradeCalculator.js';
import { requiredScoreForTarget, generateSimulation } from './logic/simulationEngine.js';
import { calculateSemesterGPA } from './logic/gpaCalculator.js';
import { simulateGPA } from './logic/gpaSimulationEngine.js';
import { GradeConverter } from './logic/gradeConverter.js';

export default {
  async fetch(request, env, ctx) {
    const url    = new URL(request.url);
    const method = request.method;

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight & required for React app to call the API
    if (method === 'OPTIONS') {
      return new Response(null, { headers });
    }


    // COURSES
    if (url.pathname === '/courses' && method === 'GET') {
      const sample = createCourse({ name: 'CSCI 3300', creditHours: 3 });
      return new Response(JSON.stringify([sample]), { headers });
    }

    // ASSIGNMENTS 
    if (url.pathname === '/assignments' && method === 'GET') {
      const sample = createAssignment({ name: 'Midterm Exam', weight: 20, grade: 88 });
      return new Response(JSON.stringify([sample]), { headers });
    }

    // COURSE AVERAGE 
    if (url.pathname === '/api/course-average' && method === 'POST') {
      const body = await request.json();
      const avg  = calculateCourseAverage(body.assignments);
      return new Response(JSON.stringify({ finalAverage: avg }), { headers });
    }

    // TARGET GRADE SIMULATION 
    if (url.pathname === '/api/target-grade' && method === 'POST') {
      const body       = await request.json();
      const required   = requiredScoreForTarget(body.current, body.finalWeight, body.target);
      const simulation = generateSimulation(body.current, body.finalWeight);
      return new Response(JSON.stringify({ requiredScore: required, simulation }), { headers });
    }

    // GRADE CONVERSION
    if (url.pathname === '/api/convert-grade' && method === 'POST') {
      const body      = await request.json();
      const converter = new GradeConverter();
      const result    = converter.convert(body.percentage);
      return new Response(JSON.stringify(result), { headers });
    }

    // Pass everything else to static assets (serves React app)
    return env.ASSETS.fetch(request);
    
  },
};