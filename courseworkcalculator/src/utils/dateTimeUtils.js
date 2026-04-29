/* 

Group Two
Dr. Porter
CSCI 3300 

Angie

*/

/* utils/dateTimeUtils.js - Shared date/time formatting and due-date helpers */

// Formats an ISO string as a readable date: "April 28, 2026"
export function formatDate(isoString) {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

// Formats an ISO string with time: "April 28, 2026 at 2:30 PM"
export function formatDateTime(isoString) {
    if (!isoString) return '—';
    const date = new Date(isoString);
    const datePart = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const timePart = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });
    return `${datePart} at ${timePart}`;
}

// Returns true if the due date has already passed
export function isOverdue(dueDateIsoString) {
    if (!dueDateIsoString) return false;
    return new Date(dueDateIsoString) < new Date();
}

// Returns true if the due date is within the given number of days (default 3)
export function isDueSoon(dueDateIsoString, daysThreshold = 3) {
    if (!dueDateIsoString) return false;
    const due = new Date(dueDateIsoString);
    const now = new Date();
    const msThreshold = daysThreshold * 24 * 60 * 60 * 1000;
    return due > now && due - now <= msThreshold;
}

// Formats a due date with context: "Due Apr 28", "Overdue", or "Due soon — Apr 30"
export function formatDueDate(dueDateIsoString) {
    if (!dueDateIsoString) return null;
    const due = new Date(dueDateIsoString);
    const label = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (isOverdue(dueDateIsoString)) return `Overdue — ${label}`;
    if (isDueSoon(dueDateIsoString)) return `Due soon — ${label}`;
    return `Due ${label}`;
}


