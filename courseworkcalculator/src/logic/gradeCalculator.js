/* 

Group Two
Dr. Porter
CSCI 3300 

gradeCalculator.js

Adam

*/

// Calculate weighted course grade from assignments
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