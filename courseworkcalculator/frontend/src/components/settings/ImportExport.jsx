/* 
Group Two 
CSCI 3300 
Dr. Porter 
Spring 2026

components/settings/ImportExport.jsx

Import & Export feature wired to real localStorage data

The default export is the React component, kept here for any future settings 
page that wants to render the same buttons.

Mackenzie 

*/

// Import all packages 
import { exportToJSON, importFromJSON } from '../../data/localStorageManager';

export function exportToTXT(appState) {
    let text = '';
    text += '|| ------------------------------------- || \n';
    text += '    COURSEWORK TRACKER - GRADE EXPORT       \n';
    text += '|| ------------------------------------- || \n';
    text += `Exported: ${new Date().toLocaleString()}\n\n`;

    appState.courses.forEach(course => {
        const courseAssignments = appState.assignments.filter(a => a.courseID === course.id);
        text += `-------------------------------------------\n`;
        text += `COURSE: ${course.name} (${course.creditHours} credit hours)\n`;
        text += `-------------------------------------------\n`;

        let totalWeight = 0;
        let earnedPoints = 0;

        courseAssignments.forEach(a => {
            const gradeDisplay = a.grade !== null ? `${a.grade}%` : 'Not graded';
            text += `  ${a.name.padEnd(25)} Weight: ${String(a.weight + '%').padEnd(6)}  Grade: ${gradeDisplay}\n`;
            if (a.grade !== null) {
                totalWeight  += a.weight;
                earnedPoints += a.grade * (a.weight / 100);
            }
        });

        const courseGrade = totalWeight > 0
            ? (earnedPoints / totalWeight * 100).toFixed(2)
            : 'N/A';
        text += `\n  Current Course Grade: ${courseGrade}%\n\n`;
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = `coursework-export-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
}

export function exportToPDF(appState) {
    if (window.jspdf) {
        generatePDF(appState);
        return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => generatePDF(appState);
    script.onerror = () => alert('Could not load PDF library. Check your internet connection and try again.');
    document.head.appendChild(script);
}

// Internal helper for the PDF generation, called from exportToPDF
function generatePDF(appState) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.setTextColor(0, 0, 102);
    doc.text('Coursework Tracker - Grade Export', 14, y);
    y += 8;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Exported: ${new Date().toLocaleString()}`, 14, y);
    y += 10;

    doc.setDrawColor(0, 51, 153);
    doc.line(14, y, 196, y);
    y += 8;

    appState.courses.forEach(course => {
        if (y > 260) { doc.addPage(); y = 20; }

        const courseAssignments = appState.assignments.filter(a => a.courseID === course.id);

        doc.setFontSize(13);
        doc.setTextColor(0, 0, 102);
        doc.text(`${course.name} (${course.creditHours} credit hrs)`, 14, y);
        y += 7;

        doc.setFontSize(9);
        doc.setTextColor(80);
        doc.text('Assignment', 14, y);
        doc.text('Weight',    110, y);
        doc.text('Grade',     155, y);
        y += 5;

        doc.setDrawColor(200);
        doc.line(14, y, 196, y);
        y += 5;

        let totalWeight  = 0;
        let earnedPoints = 0;

        courseAssignments.forEach(a => {
            if (y > 270) { doc.addPage(); y = 20; }
            doc.setFontSize(10);
            doc.setTextColor(40);
            doc.text(a.name,                                   14,  y);
            doc.text(`${a.weight}%`,                           110, y);
            doc.text(a.grade !== null ? `${a.grade}%` : '—',  155, y);
            y += 6;

            if (a.grade !== null) {
                totalWeight  += a.weight;
                earnedPoints += a.grade * (a.weight / 100);
            }
        });

        const avg = totalWeight > 0
            ? (earnedPoints / totalWeight * 100).toFixed(2)
            : 'N/A';

        y += 2;
        doc.setFontSize(10);
        doc.setTextColor(0, 100, 0);
        doc.text(`Current Grade: ${avg}%`, 14, y);
        y += 12;
    });

    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.save(`coursework-export-${new Date().toISOString().slice(0, 10)}.pdf`);
}

/* REACT COMPONENT  */
// For any future settings page that wants &
// to render these buttons in a UI

export default function ImportExport({ appState, onImport }) {
  
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await importFromJSON(file);
      onImport(data);
      alert(`Successfully imported ${data.courses?.length || 0} courses!`);
    } catch (err) {
      alert('Import failed: ' + err.message);
    }
  };

  return (
    <div style={{
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    }}>
      <h3 style={{ color: '#e2e8f0', marginBottom: '1rem', fontSize: '1rem' }}>
        Import & Export
      </h3>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button onClick={() => exportToJSON(appState)} style={btnStyle('#312e81', '#a5b4fc', '#4338ca')}>
          Export JSON
        </button>
        <button onClick={() => exportToTXT(appState)} style={btnStyle('#064e3b', '#6ee7b7', '#059669')}>
          Export TXT
        </button>
        <button onClick={() => exportToPDF(appState)} style={btnStyle('#7f1d1d', '#fca5a5', '#dc2626')}>
          Export PDF
        </button>
      </div>

      <div>
        <label style={{
          display: 'inline-block',
          padding: '0.5rem 1rem',
          background: '#1d4ed8',
          color: '#bfdbfe',
          border: '1px solid #3b82f6',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.9rem'
        }}>
            Import JSON
          <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
        </label>
        <span style={{ color: '#64748b', fontSize: '0.8rem', marginLeft: '0.75rem' }}>
          Restores a previous backup
        </span>
      </div>
    </div>
  );
}

function btnStyle(bg, color, border) {
  return {
    padding: '0.5rem 1rem',
    background: bg,
    color: color,
    border: `1px solid ${border}`,
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold',
  };
}