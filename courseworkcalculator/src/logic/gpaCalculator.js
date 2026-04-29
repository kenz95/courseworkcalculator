/* 

Group Two
Dr. Porter
CSCI 3300 

gpaCalculator.js

Mason

*/



/* logic/gpaCalculator.js - Calculating semester GPAs */

// ========== CORE GPA CALCULATION ==========

/**
 * The actual math behind GPA calculation:
 * Sum of (credit hours × grade points) / total credit hours
 */
export function calculateGPA(courses, gradeScale) {
    if (!courses || courses.length === 0) return 0;
    
    let totalQualityPoints = 0;
    let totalCredits = 0;
    
    for (const course of courses) {
        const gradeValue = course.grade || 0;
        // Find what letter grade this number corresponds to in our scale
        const points = gradeScale.find(item => gradeValue >= item.min)?.points || 0;
        
        totalQualityPoints += course.credits * points;
        totalCredits += course.credits;
    }
    
    return totalCredits > 0 ? totalQualityPoints / totalCredits : 0;
}

// ========== SEMESTER GPA ==========

/**
 * Takes all the courses in a semester, figures out each course's current grade
 * from its assignments, then calculates the overall GPA for that semester
 * Returns null if the semester has no courses
 */
export function calculateSemesterGPA(courses, assignments, gradeScale) {
    if (!courses || courses.length === 0) return null;
    
    const coursesForGPA = courses.map(course => {
        const courseAssignments = assignments.filter(a => a.courseID === course.id);
        
        let currentGrade = null;
        if (courseAssignments.length > 0) {
            let totalWeight = 0;
            let weightedSum = 0;
            for (const assignment of courseAssignments) {
                if (assignment.grade !== null && assignment.weight) {
                    totalWeight += assignment.weight;
                    weightedSum += (assignment.grade * assignment.weight);
                }
            }
            if (totalWeight > 0) {
                currentGrade = weightedSum / totalWeight;
            }
        }
        
        return {
            name: course.name,
            grade: currentGrade || 0,
            credits: course.creditHours || 3,
            final: currentGrade !== null
        };
    });
    
    const gpa = calculateGPA(coursesForGPA, gradeScale);
    return gpa.toFixed(2);
}

// ========== CUMULATIVE GPA (across multiple semesters for one institution) ==========

/**
 * Credit-weighted GPA across all semesters belonging to one institution.
 * Returns a 2-decimal string, or null if no graded courses exist.
 */
export function calculateCumulativeGPA(institutionFolders, courses, assignments, gradeScale) {
    let totalQualityPoints = 0;
    let totalCredits = 0;

    for (const folder of institutionFolders) {
        for (const course of courses.filter(c => c.folderID === folder.id)) {
            const courseAssignments = assignments.filter(a => a.courseID === course.id);
            let totalWeight = 0;
            let weightedSum = 0;
            for (const a of courseAssignments) {
                if (a.grade !== null && a.weight) {
                    totalWeight += a.weight;
                    weightedSum += a.grade * a.weight;
                }
            }
            const currentGrade = totalWeight > 0 ? weightedSum / totalWeight : 0;
            const points = gradeScale.find(item => currentGrade >= item.min)?.points || 0;
            const credits = course.creditHours || 3;
            totalQualityPoints += credits * points;
            totalCredits += credits;
        }
    }

    return totalCredits > 0 ? (totalQualityPoints / totalCredits).toFixed(2) : null;
}

