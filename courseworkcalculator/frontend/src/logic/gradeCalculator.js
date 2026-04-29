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