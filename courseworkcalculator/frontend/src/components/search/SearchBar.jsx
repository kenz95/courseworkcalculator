/* 

Group Two
Dr. Porter
CSCI 3300 

Mackenzie 

SearchBar.jsx - Holds the search bar to find courses and/or assignments 

*/

// Import all packages 
import { useState } from 'react';

/* SEARCH BAR  */ 
export default function SearchBar({ courses = [], assignments = [], folders = [], onSelectResult }) {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(false);

  const handleSearch = (value) => {
    setQuery(value);
    if (!value.trim()) { setResults([]); return; }

    const q = value.toLowerCase();
    const matched = [];

    // Search folders/semesters
    folders.forEach(f => {
      if (f.name.toLowerCase().includes(q)) {
        matched.push({ type: 'Semester', name: f.name, id: f.id, item: f });
      }
    });

    // Search courses
    courses.forEach(c => {
      if (c.name.toLowerCase().includes(q)) {
        matched.push({ type: 'Course', name: c.name, id: c.id, item: c });
      }
    });

    // Search assignments
    assignments.forEach(a => {
      if (a.name.toLowerCase().includes(q)) {
        const course = courses.find(c => c.id === a.courseID);
        matched.push({
          type: 'Assignment',
          name: a.name,
          id:   a.id,
          item: a,
          subtitle: course ? `in ${course.name}` : ''
        });
      }
    });

    setResults(matched.slice(0, 10)); // Max 10 results
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        placeholder="🔍 Search for semesters, courses, assignments..."
        style={{
          width:        '100%',
          padding:      '0.6rem 1rem',
          borderRadius: '8px',
          border:       '1px solid #334155',
          background:   '#1e293b',
          color:        '#f1f5f9',
          fontSize:     '0.9rem',
          outline:      'none',
        }}
      />

      {focused && results.length > 0 && (
        <div style={{
          position:   'absolute',
          top:        '100%',
          left:       0,
          right:      0,
          background: '#1e293b',
          border:     '1px solid #334155',
          borderRadius: '8px',
          marginTop:  '4px',
          zIndex:     1000,
          boxShadow:  '0 4px 12px rgba(0,0,0,0.3)',
        }}>
          {results.map((result, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSelectResult && onSelectResult(result);
                setQuery('');
                setResults([]);
              }}
              style={{
                padding:    '0.6rem 1rem',
                cursor:     'pointer',
                borderBottom: idx < results.length - 1 ? '1px solid #334155' : 'none',
                display:    'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#334155'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div>
                <span style={{ color: '#f1f5f9', fontSize: '0.9rem' }}>{result.name}</span>
                {result.subtitle && (
                  <span style={{ color: '#64748b', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                    {result.subtitle}
                  </span>
                )}
              </div>
              <span style={{
                background:   result.type === 'Semester' ? '#312e81' :
                              result.type === 'Course'   ? '#064e3b' : '#7f1d1d',
                color:        result.type === 'Semester' ? '#a5b4fc' :
                              result.type === 'Course'   ? '#6ee7b7' : '#fca5a5',
                padding:      '2px 8px',
                borderRadius: '4px',
                fontSize:     '0.75rem',
              }}>
                {result.type}
              </span>
            </div>
          ))}
        </div>
      )}

      {focused && query && results.length === 0 && (
        <div style={{
          position:   'absolute',
          top:        '100%',
          left:       0,
          right:      0,
          background: '#1e293b',
          border:     '1px solid #334155',
          borderRadius: '8px',
          marginTop:  '4px',
          padding:    '0.75rem 1rem',
          color:      '#64748b',
          fontSize:   '0.9rem',
        }}>
          No results for "{query}"
        </div>
      )}
    </div>
  );
}