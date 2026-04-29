/* 

Group Two
Dr. Porter
CSCI 3300 

Mackenzie 

SearchBar.jsx - Holds the search bar to find courses and/or assignments 

*/

export default function SearchBar() {
  return (
    <input
      type="text"
      placeholder="Search courses or assignments..."
      style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }}
    />
  );
}