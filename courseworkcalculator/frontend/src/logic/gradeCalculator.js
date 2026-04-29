/* 

Group Two
Dr. Porter
CSCI 3300 

gradeCalculator.js

Adam

*/

// Calculate weighted course grade from assignments
export function calculateCourseGrade(assignments) {
  const graded = assignments.filter(a => a.grade !== null && !a.isDropped);
  if (graded.length === 0) return null;
  const totalWeight = graded.reduce((sum, a) => sum + a.weight, 0);
  if (totalWeight === 0) return null;
  const weighted = graded.reduce((sum, a) => sum + (a.grade * a.weight), 0);
  return parseFloat((weighted / totalWeight).toFixed(2));
}

// Calculate weighted average from coursework array (for API use)
export function calculateCourseAverage(coursework) {
  let total = 0;
  for (let item of coursework) {
    const score = Number(item.score);
    const weight = Number(item.weight);
    if (!isNaN(score) && !isNaN(weight)) {
      total += score * (weight / 100);
    }
  }
  return Number(total.toFixed(2));
}

// Returns the default grade scale used across the app
export function getDefaultGradeScale() {
  return [
    { min: 93, points: 4.0, letter: "A" },
    { min: 90, points: 3.7, letter: "A-" },
    { min: 87, points: 3.3, letter: "B+" },
    { min: 83, points: 3.0, letter: "B" },
    { min: 80, points: 2.7, letter: "B-" },
    { min: 77, points: 2.3, letter: "C+" },
    { min: 73, points: 2.0, letter: "C" },
    { min: 70, points: 1.7, letter: "C-" },
    { min: 67, points: 1.3, letter: "D+" },
    { min: 63, points: 1.0, letter: "D" },
    { min: 60, points: 0.7, letter: "D-" },
    { min: 0,  points: 0.0, letter: "F"  },
  ];
}