let gradeScale = [
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
    { min: 0, points: 0.0, letter: "F" }
];

let courses = [
    { name: "Calculus", grade: 85, credits: 3, final: false },
    { name: "English Composition", grade: 97, credits: 3, final: false },
    { name: "Physics", grade: 92, credits: 4, final: false },
    { name: "History", grade: 93, credits: 3, final: false },
    { name: "Chemistry", grade: 78, credits: 4, final: true },
    { name: "Psychology", grade: 78, credits: 3, final: false }
];

let targetGPA = 2.0;

function getGradeScaling() {
    // This will collect the information stored in the hardcoded 'gradeScale' array above.
    // Meant for sprint 3
}

function getCourseInfo() {
    // This will collect the information shown in the hardcoded 'courses' array above.
    // Meant for sprint 3
}

function calculateGPA(courses, gradeScale) {
    // Formula for GPA: (Sum of all Courses[Credit Hours X Points (4.0, 3.0, etc.)]) / Total attempted credit hours.
    // Example:
    //      Math: Grade: A, Hours: 4, Quality Points: 4.0
    //      Science: Grade: B, Hours: 3, Quality Points: 3.0
    //      History: Grade: C, Hours: 4, Quality Points: 2.0
    //    Calculation:
    //      Math: 4 X 4 = 16
    //      Science: 3 X 3 = 9
    //      History: 4 X 2 = 8
    //      ------------------- (16 + 9 + 8)
    //          Sum: 33.0
    //      Divide by attempted hours: (4 + 3 + 4)
    //          33/11 = 3.0
    //    GPA: 3.0

    let cHours = 0; // lower case 'c' stands for 'Credit'
    let qPoints = 0; // lowercase 'q' stands for 'Quality'
    let totalHxP = 0;
    let totalHours = 0;
    let GPA = 0;

    for (let i = 0; i < courses.length; i++) {
        cHours = courses[i].credits;
        qPoints = gradeScale.find(item => courses[i].grade >= item.min).points; //NOTE* When using .find(), it returns the first instace where the paramaters hold true. That means the order of your array matters. In this context, have the Array in decending order Highest -> Lowest.

        totalHxP = totalHxP + (cHours * qPoints);
        totalHours = totalHours + cHours;
    }

    GPA = totalHxP/totalHours;
    return GPA;
}

console.log(calculateGPA(courses, gradeScale));

function simulateGPA(courses, gradeScale, targetGPA) {
    // Split courses into two groups - those already finalized (locked) and those still flexible
    // 'final: true' means the grade cannot be changed in the simulation
    // 'final: false' means the simulation can adjust this grade to help reach the target
    let lockedCourses = courses.filter(c => c.final === true);
    let flexibleCourses = courses.filter(c => c.final === false);
    
    // Edge case: If every course is locked, just return them as-is since nothing can be changed
    // No simulation needed because there are no flexible courses to adjust
    if (flexibleCourses.length === 0) {
        let results = [];
        for (let i = 0; i < lockedCourses.length; i++) {
            results.push({
                name: lockedCourses[i].name,
                grade: lockedCourses[i].grade,
                letterGrade: gradeScale.find(item => lockedCourses[i].grade >= item.min).letter,
                credits: lockedCourses[i].credits,
                final: true
            });
        }
        return results;
    }
    
    // Calculate the quality points already secured from locked courses
    // lockedQP = sum of (credits * grade points) for all finalized courses
    let lockedQP = 0;
    let lockedCredits = 0;
    for (let i = 0; i < lockedCourses.length; i++) {
        let qp = gradeScale.find(item => lockedCourses[i].grade >= item.min).points;
        lockedQP += lockedCourses[i].credits * qp;
        lockedCredits += lockedCourses[i].credits;
    }
    
    // Calculate what GPA the flexible courses need to achieve on their own to reach the overall target
    // Formula: (Target GPA * Total Credits) - Locked Quality Points = Quality Points needed from flexible courses
    // Then divide by flexible credits to get the required GPA for just those courses
    let totalCredits = 0;
    for (let i = 0; i < courses.length; i++) {
        totalCredits += courses[i].credits;
    }
    let targetTotalQP = totalCredits * targetGPA;
    let flexibleTargetQP = targetTotalQP - lockedQP;
    let flexibleCredits = totalCredits - lockedCredits;
    let adjustedTargetGPA = flexibleTargetQP / flexibleCredits;
    
    // Check if the target GPA is even mathematically possible
    // Even with perfect A's (max points) in every flexible course, can we reach the target?
    let maxPoints = gradeScale[0].points; // NOTE* gradeScale is in descending order, so index 0 is the highest grade (A = 4.0)
    let maxFlexibleQP = flexibleCredits * maxPoints;
    let maxPossibleGPA = (lockedQP + maxFlexibleQP) / totalCredits;

    if (maxPossibleGPA < targetGPA) {
        // Target is impossible to reach - return an object with an 'impossible' flag
        // The calling function can display an appropriate message to the user
        return { impossible: true, maxPossibleGPA: maxPossibleGPA, lockedCourses: lockedCourses };
    }
    
    // These variables will store the grade boundaries we need to work with
    // 'floor' = the highest grade point value BELOW our target
    // 'ceiling' = the lowest grade point value ABOVE our target
    let floor = 0;
    let ceiling = 0;
    let simResults = []; // Will hold the final grade recommendations
    
    // Check if the adjusted target GPA exactly matches a grade point value in our scale
    // Example: If target is exactly 3.0 (a B), we can just assign that to all flexible courses
    let exactMatch = gradeScale.find(qualityPoints => qualityPoints.points === adjustedTargetGPA);
    
    // Sort flexible courses by credit hours (smallest first) - helps distribute grade requirements efficiently
    // Also create an ascending copy of the grade scale for finding upper boundaries
    let coursesByCredits = [...flexibleCourses].sort((a, b) => a.credits - b.credits);
    let gradeScaleAscending = [...gradeScale].sort((a, b) => a.points - b.points);
    
    let iteration = 0; // Tracks which course we're currently adjusting in the loop
    let running = true; // Controls the while loop - becomes false when we've met the target

    // Initialize simResults with a copy of flexible courses
    // Locked flexible courses keep their grades, unlocked ones start at F (0 points)
    for (let i = 0; i < flexibleCourses.length; i++) {
        if (flexibleCourses[i].final === true) {
            simResults.push({name: flexibleCourses[i].name, grade: flexibleCourses[i].grade, letterGrade: gradeScale.find(item => flexibleCourses[i].grade >= item.min).letter, credits: flexibleCourses[i].credits, final: flexibleCourses[i].final})
        }
        else {
            simResults.push({name: flexibleCourses[i].name, grade: 0, letterGrade: "F", credits: flexibleCourses[i].credits, final: flexibleCourses[i].final});
        }
    }

    // CASE 1: The adjusted target GPA exactly matches a grade point value
    // All flexible courses just need to achieve that exact grade
    if (exactMatch && exactMatch.points === adjustedTargetGPA) {
        for (let i = 0; i < simResults.length; i++) {
            simResults[i].grade = gradeScale.find(grade => grade.points === adjustedTargetGPA).min;
            simResults[i].letterGrade = gradeScale.find(grade => grade.points === adjustedTargetGPA).letter;
        }
    }
    // CASE 2: The adjusted target falls between two grade point values
    // We need to find a combination of floor and ceiling grades to meet the target exactly
    else {
        // floor = the highest grade point value BELOW our target
        // ceiling = the lowest grade point value ABOVE our target
        floor = gradeScale.find(qualityPoints => qualityPoints.points < adjustedTargetGPA).points;
        ceiling = gradeScaleAscending.find(qualityPoints => qualityPoints.points > adjustedTargetGPA).points;

        // Start by setting all flexible courses to the floor grade (lowest acceptable)
        for (let i = 0; i < simResults.length; i++) {
            if (simResults[i].final === false) {
                simResults[i].grade = gradeScale.find(grade => grade.points === floor).min;
                simResults[i].letterGrade = gradeScale.find(grade => grade.points === floor).letter;
            }
        }

        // Gradually upgrade courses from floor to ceiling until we meet the quality point target
        // We upgrade smaller credit courses first because they have less impact per grade change
        while (running) {
            // First, check if upgrading the next course would meet or exceed our target
            for (let i = 0; i < coursesByCredits.length; i++) {
                if (coursesByCredits[i].final === false) {
                    // Calculate the quality point gain from upgrading this course from floor to ceiling
                    let currentPoints = gradeScale.find(item => simResults.find(names => names.name === coursesByCredits[i].name).grade >= item.min).points;
                    let gainFromUpgrade = coursesByCredits[i].credits * (ceiling - currentPoints);
                    let pointsNeeded = calculatePointsDifference(getGoalTotalPoints(flexibleCourses, adjustedTargetGPA), getFloorPoints(simResults, gradeScale));
                    
                    // If upgrading this course gives us enough points, do it and we're done
                    if (gainFromUpgrade >= pointsNeeded) {
                        simResults.find(names => names.name === coursesByCredits[i].name).name = coursesByCredits[i].name;
                        simResults.find(names => names.name === coursesByCredits[i].name).grade = gradeScaleAscending.find(item => ceiling <= item.points).min;
                        simResults.find(names => names.name === coursesByCredits[i].name).letterGrade = gradeScaleAscending.find(item => ceiling <= item.points).letter;
                        running = false;
                        break;
                    }
                }
            }

            if (running === false) {
                break;
            }

            // If no single upgrade meets the target, upgrade the current course and continue
            if (coursesByCredits[iteration].final === false) {
                simResults.find(names => names.name === coursesByCredits[iteration].name).grade = gradeScale.find(grades => grades.points === ceiling).min;
                simResults.find(names => names.name === coursesByCredits[iteration].name).letterGrade = gradeScale.find(grades => grades.points === ceiling).letter;
            }

            // Move to the next course, cycling back to the start if needed
            if (iteration === coursesByCredits.length - 1) {
                iteration = 0;
            }
            else {
                iteration++;
            }
        }
    }

    // Add the locked courses back to the results
    // These grades cannot be changed, so they're just appended as-is
    for (let i = 0; i < lockedCourses.length; i++) {
        simResults.push({
            name: lockedCourses[i].name,
            grade: lockedCourses[i].grade,
            letterGrade: gradeScale.find(item => lockedCourses[i].grade >= item.min).letter,
            credits: lockedCourses[i].credits,
            final: true
        });
    }

    // Return the simulation results with 'impossible: false' indicating success
    return { impossible: false, results: simResults };

    // Helper function: Calculate total quality points needed from flexible courses to hit the target
    // Formula: Sum of (credit hours * target GPA) for each flexible course
    function getGoalTotalPoints(courses, targetGPA) {
        let cHours = 0;
        let goalTotalPoints = 0;
        let totalHours = 0;

        for (let i = 0; i < courses.length; i++) {
            cHours = courses[i].credits;
            goalTotalPoints = goalTotalPoints + (cHours * targetGPA);
            totalHours = totalHours + cHours;
        }
        return goalTotalPoints;
    }

    // Helper function: Calculate current total quality points from the current simResults
    // Used to see how close we are to the target
    function getFloorPoints(courses, gradeScale) {
        let cHours = 0;
        let floorPoints = 0;

        for (let i = 0; i < courses.length; i++) {
            cHours = courses[i].credits;
            floorPoints = floorPoints + (cHours * gradeScale.find(item => courses[i].grade >= item.min).points);
        }
        return floorPoints;
    }

    // Helper function: Calculate the remaining quality points needed to reach the target
    function calculatePointsDifference(goalTotalPoints, floorPoints) {
        return goalTotalPoints - floorPoints;
    }
}

// let results = simulateGPA(courses, gradeScale, targetGPA);
// let finalGPA = calculateGPA(results, gradeScale);
// formatRecommendations(results, courses, gradeScale);
// console.log("Resulting GPA: " + finalGPA.toFixed(2));