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
import githubIcon   from '../../assets/github.svg';
import settingsIcon from '../../assets/settings.svg';

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
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef                 = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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
      background:   '#000066',
      borderBottom: '2px solid #e6b800',
      padding:      '0.65rem 1.25rem',
      display:      'flex',
      alignItems:   'center',
      gap:          '0.75rem',
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
          padding:      '0.4rem 0.9rem',
          borderRadius: '6px',
          border:       '2px solid #e6b800',
          fontWeight:   '500',
          fontSize:     '0.85rem',
          cursor:       'pointer',
          whiteSpace:   'nowrap',
        }}
      >
        📚 Home
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

      {/* GitHub  */}
      
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
        <img src={githubIcon} alt="GitHub" width="14" height="14"
          style={{ filter: iconFilter }} />
        GitHub
      </a>

      {/*  Settings dropdown  */}
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
          <img src={settingsIcon} alt="Settings" width="14" height="14"
            style={{ filter: iconFilter }} />
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
                  JSON
                </button>
                <button onClick={() => { onExportTXT?.(); setMenuOpen(false); }}
                  style={{ ...btnBase, background: '#064e3b', color: '#6ee7b7', border: '1px solid #059669' }}>
                  TXT
                </button>
                <button onClick={() => { onExportPDF?.(); setMenuOpen(false); }}
                  style={{ ...btnBase, background: '#7f1d1d', color: '#fca5a5', border: '1px solid #dc2626' }}>
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
                Import JSON Backup
              </button>
            </div>

            {/* Footer */}
            <div style={{ padding: '0.6rem 1rem' }}>
              <p style={{ color: '#475569', fontSize: '0.72rem', margin: 0, textAlign: 'center' }}>
                CSCI 3300 | Group Two | UNG 2026
              </p>
            </div>

          </div>
        )}
      </div>
    </nav>
  );
}