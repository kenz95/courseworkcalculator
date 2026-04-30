/*
Group Two
CSCI 3300
Dr. Porter
Spring 2026

Mackenzie 

components/layout/Dashboard.jsx

Displays the Main Top Navigation — Home | Search | GitHub | Settings

*/

// Import all assets, functions & packages 
import { useState, useEffect, useRef } from 'react';
import SearchBar    from '../search/SearchBar';
import Icon from '../../utils/Icon';

/* MAIN DASHBOARD */
export default function Dashboard({
  courses = [],
  assignments = [],
  folders = [],
  onSelectResult,
  onExportJSON,
  onExportTXT,
  onExportPDF,
  onImport,
  onBackToHome,
  onOpenInstitutions,
  onResetAll,

}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef                 = useRef(null);

  // CLICK OPEN SETTINGS 
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // IMPORT 
  const handleImportClick = () => {
    const input    = document.createElement('input');
    input.type     = 'file';
    input.accept   = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file && onImport) onImport(file);
    };
    input.click();
    setMenuOpen(false);
  };

  // INSTITUTIONS 
  const handleInstitutionsClick = () => {
        setMenuOpen(false);
        if (onOpenInstitutions) onOpenInstitutions();
   };

  // RESET BUTTON 
  const handleResetClick = () => {
        setMenuOpen(false);
    
        // Two-step confirmation -- destructive and irreversible
        const confirmed = window.confirm(
            'Are you sure you want to delete ALL application data?\n\n' +
            'This will permanently remove every institution, semester, course, and assignment. ' +
            'This action CANNOT be undone.\n\n' +
            'Tip: Export a backup first if you might want this data later.'
        );
        if (!confirmed) return;
    
        const reallyConfirmed = window.confirm(
         'Last chance! Click OK to permanently Delete ALL data.'
        );
            if (!reallyConfirmed) return;
    
            if (onResetAll) onResetAll();
            alert('All data has been cleared.');
        };

  const iconFilter = 'invert(1) sepia(1) saturate(2) hue-rotate(180deg)';

  const btnBase = {
    fontSize:     '0.75rem',
    cursor:       'pointer',
    borderRadius: '5px',
    padding:      '5px 0',
    flex:         1,
    border:       'none',
  };

  return (
    <nav style={{
         background:     '#000066',
        borderBottom:   '2px solid #e6b800',
        padding:        '0.65rem 1.25rem',
        display:        'grid',
        gridTemplateColumns: 'auto 1fr auto auto',
        alignItems:     'center',
        gap:            '0.75rem',
        minHeight:      '52px',
    }}>

      {/* Home */}
      <button
        onClick={onBackToHome}
        style={{
          display:      'flex',
          alignItems:   'center',
          gap:          '6px',
          background:   '#818cf8',
          color:        '#000066',
          padding:      '0.45rem 1rem',
          borderRadius: '8px',
          border:       '2px solid #e6b800',
          fontWeight:   '500',
          fontSize:     '0.85rem',
          cursor:       'pointer',
          whiteSpace:   'nowrap',
        }}
      >
     <Icon name="home" size={16} color="dark" />
        Home 

        </button>

      {/*  Search  */}
      <div style={{ flex: 1 }}>
        <SearchBar
          courses={courses}
          assignments={assignments}
          folders={folders}
          onSelectResult={(result) => {
            onSelectResult && onSelectResult(result);
            setMenuOpen(false);
          }}
        />
      </div>

      {/* GitHub */}
      
        <a href="https://github.com/kenz95/courseworkcalculator"
        target="_blank"
        rel="noreferrer"
        style={{
          display:        'flex',
          alignItems:     'center',
          gap:            '6px',
          color:          '#66c2ff',
          fontSize:       '0.82rem',
          textDecoration: 'none',
          whiteSpace:     'nowrap',
          padding:        '0.4rem 0.75rem',
          border:         '1px solid #334155',
          borderRadius:   '6px',
          background:     '#1e293b',
        }}
      >
       <Icon name="github" size={14} color="blue" />

        GitHub
      </a>

      {/*  Settings Dropdown  */}
      <div ref={menuRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          '6px',
            background:   menuOpen ? '#334155' : '#1e293b',
            border:       '1px solid #334155',
            color:        '#a5b4fc',
            padding:      '0.4rem 0.9rem',
            borderRadius: '6px',
            cursor:       'pointer',
            fontSize:     '0.82rem',
            whiteSpace:   'nowrap',
          }}
        >
         <Icon name="settings" size={14} color="blue" />
         
          Settings ▾
        </button>

        {menuOpen && (
          <div style={{
            position:     'absolute',
            right:        0,
            top:          'calc(100% + 8px)',
            background:   '#1e293b',
            border:       '1px solid #334155',
            borderRadius: '10px',
            width:        '260px',
            zIndex:       1000,
            overflow:     'hidden',
          }}>

            {/* Export */}
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #334155' }}>
              <p style={{ color: '#64748b', fontSize: '0.72rem', margin: '0 0 0.5rem', letterSpacing: '0.05em' }}>
                    EXPORT DATA
              </p>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => { onExportJSON?.(); setMenuOpen(false); }}
                  style={{ ...btnBase, background: '#312e81', color: '#a5b4fc', border: '1px solid #4338ca' }}>
                        <span style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                            <Icon name="download" size={14} color="white" />
                        </span>
                        JSON
                </button>
                <button onClick={() => { onExportTXT?.(); setMenuOpen(false); }}
                  style={{ ...btnBase, background: '#064e3b', color: '#6ee7b7', border: '1px solid #059669' }}>
                         <span style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                            <Icon name="download" size={14} color="white" />
                        </span>
                        TXT
                </button>
                <button onClick={() => { onExportPDF?.(); setMenuOpen(false); }}
                  style={{ ...btnBase, background: '#7f1d1d', color: '#fca5a5', border: '1px solid #dc2626' }}>
                        <span style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                            <Icon name="download" size={14} color="white" />
                        </span>
                         PDF
                </button>
              </div>
            </div>

            {/* Import */}
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #334155' }}>
              <p style={{ color: '#64748b', fontSize: '0.72rem', margin: '0 0 0.5rem', letterSpacing: '0.05em' }}>
                IMPORT DATA
              </p>
              <button onClick={handleImportClick}
                style={{ ...btnBase, background: '#1d4ed8', color: '#bfdbfe', border: '1px solid #3b82f6', width: '100%', padding: '6px 0' }}>
                    <span style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                        <Icon name="upload" size={14} color="white" />
                    </span>
                    Import JSON Backup
              </button>
            </div>

          {/* Institutions */}
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #334155' }}>
                <p style={{ color: '#64748b', fontSize: '0.72rem', margin: '0 0 0.5rem', letterSpacing: '0.05em' }}>
                    ORGANIZATION
                </p>
                <button onClick={handleInstitutionsClick}
                    style={{ ...btnBase, background: '#312e81', color: '#a5b4fc', border: '1px solid #4338ca', width: '100%', padding: '6px 0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                     <Icon name="building" size={14} color="white" />
                        Institutions
                </button>
            </div>

          {/* Reset Data */}
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #334155' }}>
                <p style={{ color: '#fca5a5', fontSize: '0.72rem', margin: '0 0 0.5rem', letterSpacing: '0.05em' }}>
                    RESET APPLICATION
                </p>
            <button onClick={handleResetClick}
                style={{ ...btnBase, background: '#7f1d1d', color: '#fca5a5', border: '1px solid #dc2626', width: '100%', padding: '6px 0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Icon name="trash" size={14} color="white" />
                    Delete ALL Data
            </button>
            </div>

            {/* Footer */}
            <div style={{ padding: '0.6rem 1rem' }}>
              <p style={{ color: '#475569', fontSize: '0.72rem', margin: 0, textAlign: 'center' }}>
                | 2026 | Version 1.0.4 |
              </p>
            </div>

          </div>
        )}
      </div>
    </nav>
  );
}