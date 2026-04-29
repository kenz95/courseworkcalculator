/* 

Group Two
Dr. Porter
CSCI 3300 

Angie

*/

/* utils/formattingUtils.js - Shared number/grade/GPA formatting helpers */

// Rounds a number to the specified decimal places and returns it as a number
export function roundToDecimals(value, decimals = 2) {
    return Number(Number(value).toFixed(decimals));
}

// Formats a grade number to one decimal place: 88.5
export function formatGrade(grade) {
    if (grade === null || grade === undefined) return '—';
    return Number(grade).toFixed(1);
}

// Formats a grade as a percentage string: "88.5%"
export function formatPercent(value) {
    if (value === null || value === undefined) return '—';
    return `${Number(value).toFixed(1)}%`;
}

// Formats a GPA value to two decimal places: "3.72"
export function formatGPA(gpa) {
    if (gpa === null || gpa === undefined) return '—';
    return Number(gpa).toFixed(2);
}

// Formats credit hours with singular/plural label: "1 credit" or "3 credits"
export function formatCreditHours(credits) {
    const n = Number(credits);
    return `${n} ${n === 1 ? 'credit' : 'credits'}`;
}

