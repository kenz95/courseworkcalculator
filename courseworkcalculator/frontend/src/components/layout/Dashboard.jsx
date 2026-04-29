/* 

Group Two
Dr. Porter
CSCI 3300 

Mackenzie 

Dashboard.jsx - Holds the general dashboard & search bar

*/

// Import all functions & packages 
import SearchBar from '../search/SearchBar';

export default function Dashboard({ courses = [], assignments = [], folders = [], onSelectResult }) {
  return (
    <div style={{
      background:     '#000066',
      borderBottom:   '2px solid #e6b800',
      padding:        '0.75rem 1.5rem',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      gap:            '1rem',
      flexWrap:       'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.5rem' }}>📚</span>
        <span style={{ color: '#818cf8', fontWeight: 'bold', fontSize: '1.5rem' }}>
          < a href="https://courseworkcalcalculator.mmjohn3601.workers.dev/"> Home </a>
        </span>
      </div>

      <SearchBar
        courses={courses}
        assignments={assignments}
        folders={folders}
        onSelectResult={onSelectResult}
      />

      <div style={{ color: '#66c2ff', fontSize: '1.0rem' }}>
            <a href="https://github.com/kenz95/courseworkcalculator/"> Link to GitHub Repo </a>
      </div>
    </div>
  );
}