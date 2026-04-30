/*

Group Two
CSCI 3300
Dr. Porter
Spring 2026

Mackenzie 

src/logic/alertGenerator.js
Generates automatic grade alerts based on course grades
Application Logic


*/

// Import all packages 
import { createAlert } from '../models/index.js';

// Thresholds that trigger alerts
const THRESHOLDS = {
  failing:    60,   // below 60 = failing alert
  atRisk:     70,   // below 70 = at risk warning
  lowGrade:   80,   // below 80 = low grade info
};

/** 
  Generate alerts for all courses based on current grades.
  Called whenever assignments are updated.

 * @param {Course[]} courses
 * @param {Assignment[]} assignments
 * @param {Alert[]} existingAlerts - to avoid duplicate alerts
 * @returns {Alert[]} new alerts to add
 
*/

export function generateGradeAlerts(courses, assignments, existingAlerts = []) {
  const newAlerts = [];

  for (const course of courses) {
    const courseAssignments = assignments.filter(
      a => a.courseID === course.id && a.grade !== null && !a.isDropped
    );

    if (courseAssignments.length === 0) continue;

    // Calculate current weighted grade
    const totalWeight  = courseAssignments.reduce((sum, a) => sum + a.weight, 0);
    if (totalWeight === 0) continue;

    const weightedSum  = courseAssignments.reduce((sum, a) => sum + (a.grade * a.weight), 0);
    const currentGrade = weightedSum / totalWeight;

    // Check if an alert for this course already exists and is not dismissed
    const existingAlert = existingAlerts.find(
      a => a.courseID === course.id && !a.isDismissed
    );
    if (existingAlert) continue;

    // Generate alert based on grade threshold
    if (currentGrade < THRESHOLDS.failing) {
      newAlerts.push(createAlert({
        type:     'error',
        message:  `${course.name}: Grade is ${currentGrade.toFixed(1)}% — you are currently failing.`,
        courseID: course.id,
      }));
    } else if (currentGrade < THRESHOLDS.atRisk) {
      newAlerts.push(createAlert({
        type:     'warning',
        message:  `${course.name}: Grade is ${currentGrade.toFixed(1)}% — at risk of failing.`,
        courseID: course.id,
      }));
    } else if (currentGrade < THRESHOLDS.lowGrade) {
      newAlerts.push(createAlert({
        type:     'info',
        message:  ` ${course.name}: Grade is ${currentGrade.toFixed(1)}% — consider reviewing your assignments.`,
        courseID: course.id,
      }));
    }
  }

  return newAlerts;
}

// Check for assignments with missing weights

export function generateWeightAlerts(courses, assignments, existingAlerts = []) {
  const newAlerts = [];

  for (const course of courses) {
    const courseAssignments = assignments.filter(
      a => a.courseID === course.id && !a.isDropped
    );

    if (courseAssignments.length === 0) continue;

    const totalWeight = courseAssignments.reduce((sum, a) => sum + (a.weight || 0), 0);

    // Only alert if weights are set but don't add up to 100
    if (totalWeight > 0 && Math.abs(totalWeight - 100) > 0.01) {
      const existing = existingAlerts.find(
        a => a.courseID === course.id && a.message.includes('weights') && !a.isDismissed
      );
      if (existing) continue;

      newAlerts.push(createAlert({
        type:     'warning',
        message:  `${course.name}: Assignment weights add up to ${totalWeight.toFixed(1)}% — should be 100%.`,
        courseID: course.id,
      }));
    }
  }

  return newAlerts;
}

// Run all alert checks and return combined new alerts 
export function runAllAlertChecks(courses, assignments, existingAlerts = []) {
  return [
    ...generateGradeAlerts(courses, assignments, existingAlerts),
    ...generateWeightAlerts(courses, assignments, existingAlerts),
  ];
}