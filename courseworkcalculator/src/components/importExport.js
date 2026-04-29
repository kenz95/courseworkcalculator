/* 
Group Two 
CSCI 3300 
Dr. Porter 
Spring 2026 

src/components/importExport.js

Data Access Layer
Handles Import & Export for JSON, TXT, and PDF formats.
Browser-only file uses:
	- Blob, FileReader, and jsPDF (via CDN)

*/

/* 
	SAMPLE DATA 
	TODO: Replace this with real localStorage data
*/


const sampleData = {
    courses: [
        {
            name: "Calculus 3",
            creditHours: 3,
            assignments: [
                { name: "Midterm Exam", weight: 20, grade: 88 },
                { name: "Final Exam", 	weight: 30, grade: 92 },
                { name: "Lab 1", 		weight: 10, grade: 95 },
                { name: "Quiz 1", 		weight: 10, grade: 90 }, 
            ]
        },
        {
            name: "CSCI 3300",
            creditHours: 3,
            assignments: [
                { name: "Assignment 1", weight: 20, grade: 100 },
                { name: "Assignment 2", weight: 20, grade: 95  },
                { name: "Midterm",      weight: 30, grade: 88  },
                { name: "Final",        weight: 30, grade: null },
            ]
        }
    ],
    exportedAt: new Date().toISOString(),
    version: "1.0"
};


/* 
	EXPORT: JSON
	Converts app data to a .json file and triggers download
*/

function exportJSON() {
    try {
        const json    = JSON.stringify(sampleData, null, 2);
        const blob    = new Blob([json], { type: 'application/json' });
        const url     = URL.createObjectURL(blob);
        const link    = document.createElement('a');
        link.href     = url;
        link.download = `coursework-export-${getDateStamp()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        showStatus('JSON exported successfully!', 'success');
    } catch (err) {
        showStatus('Export failed: ' + err.message, 'error');
    }
}


/* 
	EXPORT: TXT
	Formats data as human-readable plain text and downloads
*/

function exportTXT() {
    try {
        let text = '';
        text += '|| ------------------------------------- || \n';
        text += '   COURSEWORK TRACKER - GRADE EXPORT\n';
        text += '|| ------------------------------------- || \n';
        text += `Exported: ${new Date().toLocaleString()}\n\n`;

        sampleData.courses.forEach(course => {
            text += '|| ---------------------------------------------------- || \n';
            text += `COURSE: ${course.name} (${course.creditHours} credit hours)\n`;
            text += '|| ---------------------------------------------------- || \n';

            let totalWeight  = 0;
            let earnedPoints = 0;

            course.assignments.forEach(a => {
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

        text += '|| ------------------------------------ || \n';
        text += '   CSCI 3300 | Group Two | UNG 2026\n';
        text += '|| ------------------------------------ || \n';

        const blob    = new Blob([text], { type: 'text/plain' });
        const url     = URL.createObjectURL(blob);
        const link    = document.createElement('a');
        link.href     = url;
        link.download = `coursework-export-${getDateStamp()}.txt`;
        link.click();
        URL.revokeObjectURL(url);
        showStatus('TXT exported successfully!', 'success');
    } catch (err) {
        showStatus('Export failed: ' + err.message, 'error');
    }
}


/* 
	EXPORT: PDF
	Uses jsPDF (loaded via CDN in the HTML) to generate a PDF
*/

function exportPDF() {
    try {
        const { jsPDF } = window.jspdf;
        const doc       = new jsPDF();

        let y = 20; // vertical cursor position

        // Title
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 102);
        doc.text('Coursework Tracker - Grade Export', 14, y);
        y += 8;

        // Subtitle
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Exported: ${new Date().toLocaleString()}`, 14, y);
        y += 10;

        // Divider line
        doc.setDrawColor(0, 51, 153);
        doc.line(14, y, 196, y);
        y += 8;

        // Courses
        sampleData.courses.forEach(course => {
            // Page break if needed
            if (y > 260) {
                doc.addPage();
                y = 20;
            }

            // Course heading
            doc.setFontSize(13);
            doc.setTextColor(0, 0, 102);
            doc.text(`${course.name} (${course.creditHours} credit hrs)`, 14, y);
            y += 7;

            // Column headers
            doc.setFontSize(9);
            doc.setTextColor(80);
            doc.text('Assignment',   14,  y);
            doc.text('Weight',       110, y);
            doc.text('Grade',        155, y);
            y += 5;

            // Header underline
            doc.setDrawColor(200);
            doc.line(14, y, 196, y);
            y += 5;

            // Assignment rows
            let totalWeight  = 0;
            let earnedPoints = 0;

            course.assignments.forEach(a => {
                if (y > 270) { doc.addPage(); y = 20; }

                doc.setFontSize(10);
                doc.setTextColor(40);
                doc.text(a.name,                                     14,  y);
                doc.text(`${a.weight}%`,                             110, y);
                doc.text(a.grade !== null ? `${a.grade}%` : '—',    155, y);
                y += 6;

                if (a.grade !== null) {
                    totalWeight  += a.weight;
                    earnedPoints += a.grade * (a.weight / 100);
                }
            });

            // Course average
            const avg = totalWeight > 0
                ? (earnedPoints / totalWeight * 100).toFixed(2)
                : 'N/A';

            y += 2;
            doc.setFontSize(10);
            doc.setTextColor(0, 100, 0);
            doc.text(`Current Grade: ${avg}%`, 14, y);
            y += 12;
        });

        // Footer
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text('CSCI 3300 | Group Two | UNG 2026', 14, 285);

        doc.save(`coursework-export-${getDateStamp()}.pdf`);
        showStatus('PDF exported successfully!', 'success');
    } catch (err) {
        showStatus('PDF export failed: ' + err.message, 'error');
    }
}


/* 
	 IMPORT: JSON
	 Reads a .json file and loads it back into the app
*/

function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.json')) {
        showStatus('Please select a .json file.', 'error');
        return;
    }

    const reader    = new FileReader();
    reader.onload   = function(e) {
        try {
            const data = JSON.parse(e.target.result);

            // Basic validation — check expected structure
            if (!data.courses || !Array.isArray(data.courses)) {
                showStatus('Invalid file: missing courses data.', 'error');
                return;
            }

            // Display preview of imported data
            showImportPreview(data);
            showStatus(`Imported ${data.courses.length} course(s) successfully!`, 'success');
        } catch (err) {
            showStatus('Import failed: Invalid JSON file.', 'error');
        }
    };
    reader.onerror  = () => showStatus('Could not read file.', 'error');
    reader.readAsText(file);
}


/*

 HELPER FUNCTIONS 

*/

// Show imported data as a preview table
function showImportPreview(data) {
    const preview = document.getElementById('importPreview');
    if (!preview) return;

    let html = `<h3 style="color:#003399; margin-bottom:0.5rem;">
                  Imported: ${data.courses.length} Course(s)
                </h3>`;

    data.courses.forEach(course => {
        html += `<div style="margin-bottom:1rem; padding:0.75rem;
                             background:#f8f9fa; border-radius:6px;
                             border-left:4px solid #003399;">`;
        html += `<strong>${course.name}</strong> — ${course.creditHours} credit hrs<br/>`;
        html += `<small style="color:#666;">${course.assignments.length} assignment(s)</small>`;
        html += `</div>`;
    });

    preview.innerHTML = html;
    preview.style.display = 'block';
}

// Show status messages
function showStatus(message, type) {
    const el = document.getElementById('statusMessage');
    if (!el) return;
    el.textContent    = message;
    el.style.display  = 'block';
    el.style.background = type === 'success' ? '#d4edda' : '#f8d7da';
    el.style.color      = type === 'success' ? '#155724' : '#721c24';
    el.style.border     = `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`;
    setTimeout(() => { el.style.display = 'none'; }, 4000);
}

// Date stamp for filenames
function getDateStamp() {
    return new Date().toISOString().slice(0, 10);
}