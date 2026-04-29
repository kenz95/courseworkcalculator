/* 

Group Two
Dr. Porter
CSCI 3300 

gpaSimualtionEngine.js

Mason

*/


/* logic/gpaSimulationEngine.js - The "what-if" GPA simulator */

// ========== HELPER FUNCTION ==========

// Just calculates GPA from a list. Used internally by the simulator.
function calculateGPAFromList(coursesList, scale) {
    let totalHxP = 0;
    let totalHours = 0;

    for (let i = 0; i < coursesList.length; i++) {
        const cHours = coursesList[i].credits;
        const gradeValue = coursesList[i].grade;
        const points = scale.find(item => gradeValue >= item.min)?.points || 0;
        
        totalHxP += cHours * points;
        totalHours += cHours;
    }

    return totalHours > 0 ? totalHxP / totalHours : 0;
}

// ========== MAIN SIMULATION ENGINE ==========

// This is the main simulation engine. Basically the simulation will take a goal GPA, and try to 
// figure out what classes need what grades in order to make or suppass your target GPA.
// First the engine will split courses into flexible and unflexible courses. This is incase
// there's a scenario where a student knows they can't get a higher grade in their class.
// Then the engine will recalculate the necessary GPA to reach amongst the flexible classes/unlocked classes.
// After that the engine will set every course to the first possible quality point below the goal, so if we want a 
// 3.62, it will set the classes to whatever grade give a 3.3. Then it will raise each course one by one
// and see if it meets the goal. If not it will permanently raise the grade with the lowest credit hours and 
// repeat the cycle until eventually the GPA goal has been met.
//
// If it's impossible to get the target GPA it will report that to the user.
export function simulateGPA(coursesList, scale, target) {
    const lockedCourses = coursesList.filter(c => c.final === true);
    const flexibleCourses = coursesList.filter(c => c.final === false);

    // If all courses are locked will just return what's already there.
    if (flexibleCourses.length === 0) {
        let results = lockedCourses.map(c => ({
            name: c.name,
            grade: c.grade,
            letterGrade: scale.find(item => c.grade >= item.min)?.letter || "F",
            credits: c.credits,
            final: true
        }));
        return { impossible: false, results: results };
    }

    // Calculate quality points from locked courses first
    let lockedQP = 0;
    let lockedCredits = 0;
    for (let i = 0; i < lockedCourses.length; i++) {
        const qp = scale.find(item => lockedCourses[i].grade >= item.min)?.points || 0;
        lockedQP += lockedCourses[i].credits * qp;
        lockedCredits += lockedCourses[i].credits;
    }

    const totalCredits = coursesList.reduce((sum, c) => sum + c.credits, 0);
    const targetTotalQP = totalCredits * target;
    const flexibleTargetQP = targetTotalQP - lockedQP;
    const flexibleCredits = totalCredits - lockedCredits;
    const adjustedTargetGPA = flexibleTargetQP / flexibleCredits;

    // Check if target is even possible
    const maxPoints = scale[0].points;
    const maxFlexibleQP = flexibleCredits * maxPoints;
    const maxPossibleGPA = (lockedQP + maxFlexibleQP) / totalCredits;

    if (maxPossibleGPA < target) {
        return { impossible: true, maxPossibleGPA: maxPossibleGPA };
    }

    // Figures out which courses need which grades by upgrading them one by one.
    const exactMatch = scale.find(item => item.points === adjustedTargetGPA);
    const coursesByCredits = [...flexibleCourses].sort((a, b) => a.credits - b.credits);
    const scaleAscending = [...scale].sort((a, b) => a.points - b.points);

    let simResults = flexibleCourses.map(c => ({
        name: c.name,
        grade: c.final ? c.grade : 0,
        letterGrade: c.final ? (scale.find(item => c.grade >= item.min)?.letter || "F") : "F",
        credits: c.credits,
        final: c.final,
        originalName: c.name
    }));

    if (exactMatch && exactMatch.points === adjustedTargetGPA) {
        // Exact match - all flexible courses need the same grade
        for (let i = 0; i < simResults.length; i++) {
            if (!simResults[i].final) {
                const targetGrade = scale.find(g => g.points === adjustedTargetGPA);
                simResults[i].grade = targetGrade.min;
                simResults[i].letterGrade = targetGrade.letter;
            }
        }
    } else {
        // Mixing grades (some A's, some B's, etc.)
        const floor = scale.find(item => item.points < adjustedTargetGPA)?.points || scale[scale.length-1].points;
        const ceiling = scaleAscending.find(item => item.points > adjustedTargetGPA)?.points || scale[0].points;

        // Start everyone at the floor grade
        for (let i = 0; i < simResults.length; i++) {
            if (!simResults[i].final) {
                const floorGrade = scale.find(g => g.points === floor);
                simResults[i].grade = floorGrade.min;
                simResults[i].letterGrade = floorGrade.letter;
            }
        }

        // Keep upgrading courses until the target is hit
        // Upgrade smaller credit courses first - this is because we are assuming courses with less credit hours are easier to get a higher grade in.
        let iteration = 0;
        let running = true;

        while (running) {
            let upgraded = false;
            for (let i = 0; i < coursesByCredits.length; i++) {
                const course = coursesByCredits[i];
                if (!course.final) {
                    const currentResult = simResults.find(r => r.name === course.name);
                    const currentPoints = scale.find(item => currentResult.grade >= item.min)?.points || 0;
                    const gainFromUpgrade = course.credits * (ceiling - currentPoints);
                    
                    const currentFlexQP = simResults
                        .filter(r => !r.final)
                        .reduce((sum, r) => sum + (r.credits * (scale.find(item => r.grade >= item.min)?.points || 0)), 0);
                    const pointsNeeded = flexibleTargetQP - currentFlexQP;

                    // If upgrading this one course works then finishes cycle
                    if (gainFromUpgrade >= pointsNeeded) {
                        const ceilingGrade = scaleAscending.find(item => ceiling <= item.points);
                        currentResult.grade = ceilingGrade.min;
                        currentResult.letterGrade = ceilingGrade.letter;
                        running = false;
                        upgraded = true;
                        break;
                    }
                }
            }

            if (!upgraded) {
                // If the goal has not been met, keep repeating the process of upping one course
                const courseToUpgrade = coursesByCredits[iteration % coursesByCredits.length];
                if (!courseToUpgrade.final) {
                    const resultToUpgrade = simResults.find(r => r.name === courseToUpgrade.name);
                    const ceilingGrade = scaleAscending.find(item => ceiling <= item.points);
                    resultToUpgrade.grade = ceilingGrade.min;
                    resultToUpgrade.letterGrade = ceilingGrade.letter;
                }
                iteration++;
            } else {
                break;
            }
        }
    }

    const allResults = [...simResults, ...lockedCourses];
    return { impossible: false, results: allResults };
}

// ========== FORMAT RESULTS FOR DISPLAY ==========

// Formats the output to be more understandable to the user.
// 
// NOTE* In some cases you may run into a situation where you have multiple classes with
// the same credit hours, and only some of them need to change. In those cases it makes
// more sense to say "You need X grade in classes Y and Z" because this would
// allow the user to decide what class they want to get a certain grade in instead of being told
// they need a specific grade in Math when they might not be good at Math.
//
// If all courses need the same grade just list each one individually.
export function formatSimulationResults(results, originalCourses, target, gradeScale) {
    if (results.impossible === true) {
        return {
            impossible: true,
            maxPossibleGPA: results.maxPossibleGPA,
            target: target
        };
    }

    const simResults = results.results;
    
    // Split into locked vs flexible
    const lockedResults = [];
    const flexibleResults = [];
    
    for (const course of simResults) {
        const originalCourse = originalCourses.find(oc => oc.name === course.name);
        const isLocked = originalCourse?.final === true;
        
        if (isLocked) {
            lockedResults.push({
                name: course.name,
                grade: course.grade,
                letter: course.letterGrade,
                credits: course.credits,
                locked: true
            });
        } else {
            flexibleResults.push({
                name: course.name,
                grade: course.grade,
                letter: course.letterGrade,
                credits: course.credits,
                locked: false
            });
        }
    }
    
    // Group flexible courses by credit hours. Same credit courses can be swapped around.
    const byCredits = {};
    for (const course of flexibleResults) {
        if (!byCredits[course.credits]) {
            byCredits[course.credits] = [];
        }
        byCredits[course.credits].push(course);
    }
    
    const outputItems = [];
    
    // Locked courses just show as-is with a [Final] tag
    for (const course of lockedResults) {
        outputItems.push({
            type: 'locked',
            name: course.name,
            grade: course.grade,
            letter: course.letter
        });
    }
    
    // Handles flexible courses
    for (const credits in byCredits) {
        const coursesInGroup = byCredits[credits];
        const firstGrade = coursesInGroup[0].letter;
        const allSameGrade = coursesInGroup.every(c => c.letter === firstGrade);
        
        if (allSameGrade) {
            // If every course needs the same grade list them individually.
            for (const course of coursesInGroup) {
                outputItems.push({
                    type: 'flexible',
                    name: course.name,
                    grade: course.grade,
                    letter: course.letter
                });
            }
        } else {
            // formatting for differnt grades needed
            const gradeCounts = {};
            const gradeExamples = {};
            const courseNames = [];
            
            for (const course of coursesInGroup) {
                if (!gradeCounts[course.letter]) {
                    gradeCounts[course.letter] = 0;
                    gradeExamples[course.letter] = course.grade;
                }
                gradeCounts[course.letter]++;
                courseNames.push(course.name);
            }
            
            const gradeParts = [];
            for (const [grade, count] of Object.entries(gradeCounts)) {
                if (count === 1) {
                    gradeParts.push(`${grade} (${gradeExamples[grade]})`);
                } else {
                    gradeParts.push(`${count} ${grade}'s (${gradeExamples[grade]})`);
                }
            }
            
            let requirementText = "";
            for (let i = 0; i < gradeParts.length; i++) {
                if (i === gradeParts.length - 1 && gradeParts.length > 1) {
                    requirementText += ` and ${gradeParts[i]}`;
                } else if (i > 0) {
                    requirementText += `, ${gradeParts[i]}`;
                } else {
                    requirementText += gradeParts[i];
                }
            }
            
            const courseList = courseNames.join(", ");
            outputItems.push({
                type: 'distribution',
                text: `You need ${requirementText} in ${courseList}`
            });
        }
    }
    
    const finalGPA = calculateGPAFromList(simResults, gradeScale);
    
    return {
        impossible: false,
        target: target,
        finalGPA: finalGPA.toFixed(2),
        items: outputItems
    };
}

