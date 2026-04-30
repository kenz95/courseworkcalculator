/* 

Group Two
Dr. Porter
CSCI 3300 

Mackenzie 

Settings.jsx - Holds the Settings Tab 

*/

import { clearStorage } from '../../data/localStorageManager';

export default function SettingsPanel({ onResetAll }) {
    
    const handleReset = () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete ALL application data?\n\n' +
            'This will permanently remove every semester, course, and assignment. ' +
            'This action CANNOT be undone.\n\n' +
            'Tip: Export a backup first if you might want this data later.'
        );
        
        if (!confirmed) return;
        
        // Second confirm — destructive actions deserve two clicks
        const reallyConfirmed = window.confirm(
            'Last chance. Click OK to permanently delete all data.'
        );
        
        if (!reallyConfirmed) return;
        
        clearStorage();
        if (onResetAll) onResetAll();
        alert('All data has been cleared.');
    };
    
    return (
        <div style={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
        }}>
            <h3 style={{ color: '#e2e8f0', marginBottom: '0.75rem', fontSize: '1rem' }}>
                Reset Application
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: '1.5' }}>
                Permanently delete all semesters, courses, and assignments stored in this browser. 
                Consider exporting a backup first.
            </p>
            <button
                onClick={handleReset}
                style={{
                    padding: '0.5rem 1rem',
                    background: '#7f1d1d',
                    color: '#fca5a5',
                    border: '1px solid #dc2626',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                }}
            >
                🗑️ Delete All Data
            </button>
        </div>
    );
}