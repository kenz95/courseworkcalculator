/* 
Group Two 
CSCI 3300 
Dr. Porter 
Spring 2026 

Mackenzie 

utils/courseColors.js 

Curated color palette for courses & contrast check.
Used by both App.jsx (when adding new courses) and 
localStorageManager.js (when migrating old saved data).

*/

export const COURSE_COLORS = [
    '#6366f1', // indigo
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#06b6d4', // cyan
    '#ec4899', // pink
    '#3b82f6', // blue
];

// Returns true if the color is dark enough for white text to be readable
export function hasGoodContrast(hex) {
    if (!hex || typeof hex !== 'string') return false;
    
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    if (h.length !== 6) return false;
    
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    
    if (isNaN(r) || isNaN(g) || isNaN(b)) return false;
    
    const luminance = (0.299 * r) + (0.587 * g) + (0.114 * b);
    return luminance < 140;
}