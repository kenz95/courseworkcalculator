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

    // HOME PAGE
    if (url.pathname === '/' && method === 'GET') {
      const html = `
        <!DOCTYPE html> 
        <html lang="en">
        <head> 
            <meta charset="UTF-8" /> 
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Coursework Tracker & GPA Calculator</title>
        </head> 
        <style> 
          * { margin: 0; padding: 0; box-sizing: border-box; } 
          body { 
            font-family: Arial, sans-serif; 
            background: #00004d;
            color: #f1f5f9; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            min-height: 100vh; 
            text-align: center; 
            padding: 2rem; 
          }
          h1 {
            font-size: 2.5rem; 
            margin-bottom: 1rem; 
            background: #003399;
            color: #818cf8; 
            border-radius: 8px;
            border: 2px solid #e6b800;
            padding: 0.5rem 1.5rem; 
          }
          footer {
            padding: 0.5rem 1.5rem; 
            margin: 2rem; 
            background: #818cf8;
            border-radius: 8px;
            border: 2px solid #e6b800;
          } 
          .foot { color: #000066; font-size: 0.8rem; text-align: center; }
          p { font-size: 1.5rem; margin-bottom: 2rem; color: #b3bdcc; } 
          .badge { 
            background: #818cf8; color: #49df6e;  
            border: 2px solid #e6b800; border-radius: 8px; 
            padding: 0.5rem 1.5rem; font-size: 1.0rem;
            text-align: center; margin-bottom: 2rem;
          }
          .team {
            margin-top: 2rem; background: #003399;
            border: 2px solid #e6b800; border-radius: 8px; 
            padding: 0.5rem 1.5rem; color: #66c2ff; 
            font-size: 0.9rem; margin-bottom: 2rem;
          }
          .btn { 
            display: inline-block; margin-top: 1rem;
            padding: 0.6rem 1.5rem; background: #818cf8;
            color: #66c2ff; border: 2px solid #e6b800;
            border-radius: 8px; text-decoration: none; font-size: 1rem;
          }
          .routes {
            background: #1e293b; border: 1px solid #334155;
            border-radius: 12px; padding: 1.5rem 2rem;
            text-align: left; width: 100%; max-width: 480px;
            margin-bottom: 2rem;
          }
          .routes h2 { color: #94a3b8; margin-bottom: 1rem; font-size: 1rem; }
          .route { display: flex; gap: 1rem; align-items: center;
            padding: 0.5rem 0; border-bottom: 1px solid #334155; }
          .route:last-child { border-bottom: none; }
          .method { background: #312e81; color: #818cf8; font-size: 0.75rem;
            font-weight: bold; padding: 2px 8px; border-radius: 4px;
            width: 50px; text-align: center; }
          .path { font-family: monospace; color: #f1f5f9; font-size: 0.9rem; }
          .desc { color: #64748b; font-size: 0.8rem; margin-left: auto; }
          .nxtSprint {
            margin-top: 2rem; background: #003399;
            border: 2px solid #e6b800; border-radius: 8px; 
            padding: 0.5rem 1.5rem; color: #66c2ff; 
            font-size: 1rem; margin-bottom: 2rem;
          }
        </style> 
        <body>
          <h1>Coursework Tracker</h1> 
          <p>A Coursework & GPA tracking tool for both students & professors.</p>
          <div class="badge"> ✅ API is running </div> 

          <div class="routes">
            <h2>API ENDPOINTS</h2>
            <div class="route">
              <span class="method">GET</span>
              <span class="path">/courses</span>
              <span class="desc">List courses</span>
            </div>
            <div class="route">
              <span class="method">GET</span>
              <span class="path">/assignments</span>
              <span class="desc">List assignments</span>
            </div>
            <div class="route">
              <span class="method">POST</span>
              <span class="path">/api/course-average</span>
              <span class="desc">Calculate average</span>
            </div>
            <div class="route">
              <span class="method">POST</span>
              <span class="path">/api/target-grade</span>
              <span class="desc">Target grade sim</span>
            </div>
            <div class="route">
              <span class="method">POST</span>
              <span class="path">/api/convert-grade</span>
              <span class="desc">Convert grade</span>
            </div>
          </div>

          <a class="btn" href="/simulationModel.html"> 📊 View GPA Simulation →</a>

          <p class="nxtSprint"> Next: React frontend connected at localhost:5173</p>
          <footer>
            <div class="foot"> Questions or Concerns? </div>
            <div class="foot"><a href="mailto:mmjohn3601@ung.edu">mmjohn3601@ung.edu</a></div>
          </footer> 
        </body>
        </html>`;
      return new Response(html, { headers: { 'Content-Type': 'text/html' } });
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

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
  },
};