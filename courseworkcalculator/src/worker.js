/* 
Group Two 
CSCI 3300 
Dr. Porter 
Spring 2026 

worker.js 

Main Homepage without/before the Wragnler deployment to add mutli layered structure. 

*/


import { createCourse, createAssignment } from './models/index.js';
import { calculateCourseAverage } from './logic/gradeCalculator.js';
import { requiredScoreForTarget, generateSimulation } from './logic/simulationEngine.js';


export default {
  async fetch(request, env, ctx) {
  const url    = new URL(request.url);
    const method = request.method;

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };

    if (url.pathname === '/' && method === 'GET') {
    
    // Display simple HTML for Sprint Two! 
    const html = `
        <!DOCTYPE html> 
        <html lang="en">
        <head> 
            <meta charset="UTF-8" /> 
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title> Coursework Tracker & GPA Calculator </title>
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

        .foot { 
            color: #000066;
            font-size: 0.8rem; 
            text-align: center;
        }
        
        p {
            font-size: 1.5rem; 
            margin-bottom: 2rem; 
            color: #b3bdcc;      
        } 
      
        .badge { 
            background: #818cf8;
            color: #49df6e;  
            border: 2px solid #e6b800; 
            border-radius: 8px; 
            padding: 0.5rem 1.5rem; 
            font-size: 1.0rem;
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .team {
            margin-top: 2rem; 
            background: #003399;
            border: 2px solid #e6b800; 
            border-radius: 8px; 
            padding: 0.5rem 1.5rem;
            color: #66c2ff; 
            font-size: 0.9rem;
            margin-bottom: 2rem;

        }
        
        .simBttn {
            display: inline-block;
            margin-top: 1rem;
            padding: 0.6rem 1.5rem;
            background: #818cf8;
            color: #66c2ff;
            border: 2px solid #e6b800;
            border-radius: 8px;
            text-decoration: none;
            font-size: 1rem;
        }
        
        .nxtSprint {
            margin-top: 2rem; 
            background: #003399;
            border: 2px solid #e6b800; 
            border-radius: 8px; 
            padding: 0.5rem 1.5rem;
            color: #66c2ff; 
            font-size: 1rem;
            margin-bottom: 2rem;
        } 

        </style> 
        <body>
          <h1> Coursework Tracker </h1> 
          <p> A Coursework & GPA tracking tool for both students & professors. </p>
          <div class="badge"> API is running </div> 
          <p class="team"> Group Two: Adam || Mason || Angie || Mackenzie </p> 
          <p class="nxtSprint"> Next Sprint Three: Begin adding final UI/UX components, importing & exporting, multi-instiutional support, grade scaling, and search bar functionality.</p> 
          <p class="simBttn"> <a href="/simulationModel.html"> View GPA Simulation → </a>
          <footer>
             <div class="foot"> CSCI 3300 || Dr. Porter || UNG 2026 </div>
            <div class="foot"> <a href="mailto:mmjohn3601@ung.edu"> mmjohn3601@ung.edu </a> </div>
          </footer> 
        </body>
        </html> 
    `
       return new Response(html, { headers: { 'Content-Type': 'text/html' },
      });
  }

    if (url.pathname === '/courses' && method === 'GET') {
      const sample = createCourse({ name: 'CSCI 3300', creditHours: 3 });
      return new Response(JSON.stringify([sample]), { headers });
    }

    if (url.pathname === '/assignments' && method === 'GET') {
      const sample = createAssignment({ name: 'Midterm Exam', weight: 20, grade: 88 });
      return new Response(JSON.stringify([sample]), { headers });
    }
        
    if (url.pathname === '/api/course-average' && method === 'POST') {
        const body = await request.json();
        const avg = calculateCourseAverage(body.assignments);
        return new Response(JSON.stringify({ finalAverage: avg }), { headers });
    }
    
    if (url.pathname === '/api/target-grade' && method === 'POST') {
        const body = await request.json();
        const required = requiredScoreForTarget(body.current, body.finalWeight, body.target);
        const simulation = generateSimulation(body.current, body.finalWeight);
        return new Response(JSON.stringify({ requiredScore: required, simulation }), { headers });
    }
    
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
  },
};