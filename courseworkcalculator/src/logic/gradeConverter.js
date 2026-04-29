/* 

Group Two
Dr. Porter
CSCI 3300 

gradeConverter.js

Adam

*/


export class GradeConverter {
  constructor(config = {}) {
    this.letterScale = [
    { min: 93, grade: "A" },
    { min: 90, grade: "A-" },
    { min: 87, grade: "B+" },
    { min: 83, grade: "B" },
    { min: 80, grade: "B-" },
    { min: 77, grade: "C+" },
    { min: 73, grade: "C" },
    { min: 70, grade: "C-" },
    { min: 60, grade: "D" },
    { min: 0, grade: "F" },
    ];

    this.gpaScale = {
    "A": 4.0,
    "A-": 3.7,
    "B+": 3.3,
    "B": 3.0,
    "B-": 2.7,
    "C+": 2.3,
    "C": 2.0,
    "C-": 1.7,
    "D": 1.0,
    "F": 0.0
    };
}

  percentageToLetter(percent) {
    return this.letterScale.find(g => percent >= g.min)?.grade || "F";
  }

  letterToGPA(letter) {
    return this.gpaScale[letter] ?? null;
  }

  percentageToGPA(percent) {
    const letter = this.percentageToLetter(percent);
    return this.letterToGPA(letter);
  }

  convert(percent) {
    const letter = this.percentageToLetter(percent);
    return {
      percentage: percent,
      letter,
      gpa: this.letterToGPA(letter),
    };
  }
}