/* 

Group Two
Dr. Porter
CSCI 3300 

gradeConverter.js

Adam & Mason's adpated per-semester gradeScale.

*/

import { getDefaultGradeScale } from './gradeCalculator';

export class GradeConverter {
    constructor(gradeScale = null) {
        // Mason's scale shape: [{ min, points, letter }, ...]
        // Default to Mason's +/- scale if nothing is passed in
        const scale = gradeScale || getDefaultGradeScale();
        
        // Build Adam's internal lookup tables from Mason's scale
        this.letterScale = scale.map(s => ({ min: s.min, grade: s.letter }));
        
        this.gpaScale = {};
        for (const s of scale) {
            this.gpaScale[s.letter] = s.points;
        }
    }

    percentageToLetter(percent) {
        if (percent === null || percent === undefined || isNaN(percent)) return null;
        return this.letterScale.find(g => percent >= g.min)?.grade || "F";
    }

    letterToGPA(letter) {
        return this.gpaScale[letter] ?? null;
    }

    percentageToGPA(percent) {
        const letter = this.percentageToLetter(percent);
        return letter ? this.letterToGPA(letter) : null;
    }

    convert(percent) {
        if (percent === null || percent === undefined || isNaN(percent)) {
            return { percentage: percent, letter: null, gpa: null };
        }
        const letter = this.percentageToLetter(percent);
        return {
            percentage: percent,
            letter,
            gpa: this.letterToGPA(letter),
        };
    }
}