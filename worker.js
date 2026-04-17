/* 
Group Two 
CSCI 3300 
Dr. Porter 
Spring 2026 

worker.js 

Main Homepage without/before the Wragnler deployment to add mutli layered structure. 

*/


export default {
  async fetch(request, env, ctx) {
  const url    = new URL(request.url);
    const method = request.method;

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };

    if (url.pathname === '/' && method === 'GET') {
    
    // Display simple HTML for Sprint One! 
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
          <p class="nxtSprint"> Next Sprint: Connect to Wrangler CLI & GitHub. Add Folders, Courses, & Assignments. Also add Grade & GPA logic calculations.</p> 
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

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
      },
};
