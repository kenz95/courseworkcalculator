/* 

Group Two
Dr. Porter
CSCI 3300 

Mason & 
Edits by Mackenzie for imports & connecting all team member's code

*/

let inputModal = document.getElementById("inputModal");
let resultsModal = document.getElementById("resultsModal");
let simulateBtn = document.getElementById("simulateBtn");
let settingsBtn = document.getElementById("settingsBtn");
let closeInputBtn = document.getElementById("closeInputBtn");
let closeResultsBtn = document.getElementById("closeResultsBtn");
let cancelSimBtn = document.getElementById("cancelSimBtn");
let runSimBtn = document.getElementById("runSimBtn");
let backToInputBtn = document.getElementById("backToInputBtn");
let resultsOutput = document.getElementById("resultsOutput");
let targetGPAInput = document.getElementById("targetGPAInput");

// Holds the current course data while user edits in the modal
// This gets updated when grades or finalized checkboxes change
let currentCourses = [];
let currentTargetGPA = targetGPA;

function populateCourseTable() {
    const tableBody = document.getElementById("courseTableBody");
    tableBody.innerHTML = "";
    
    // Create a fresh copy of the original courses so we don't modify the source
    currentCourses = JSON.parse(JSON.stringify(courses));
    
    for (let i = 0; i < currentCourses.length; i++) {
        let row = tableBody.insertRow();
        
        // Column 1: Course name (display only, cannot be edited)
        let nameCell = row.insertCell(0);
        nameCell.textContent = currentCourses[i].name;
        nameCell.className = "course-name";
        
        // Column 2: Numerical grade input box
        // User can type any number between 0 and 100
        let gradeCell = row.insertCell(1);
        let gradeInput = document.createElement("input");
        gradeInput.type = "number";
        gradeInput.value = currentCourses[i].grade;
        gradeInput.step = "1";
        gradeInput.min = "0";
        gradeInput.max = "100";
        gradeInput.className = "grade-input";
        // When the grade changes, update our stored copy
        gradeInput.addEventListener("change", (function(index) {
            return function(e) {
                currentCourses[index].grade = parseInt(e.target.value) || 0;
            };
        })(i));
        gradeCell.appendChild(gradeInput);
        
        // Column 3: Letter grade (auto-updates based on numerical grade)
        // This is display only - calculated from the grade scale
        let letterCell = row.insertCell(2);
        let letterSpan = document.createElement("span");
        letterSpan.className = "letter-grade";
        letterSpan.textContent = gradeScale.find(item => currentCourses[i].grade >= item.min).letter;
        // When numerical grade changes, update the letter grade too
        gradeInput.addEventListener("change", (function(span, index) {
            return function(e) {
                let grade = parseInt(e.target.value) || 0;
                let letter = gradeScale.find(item => grade >= item.min).letter;
                span.textContent = letter;
                currentCourses[index].grade = grade;
            };
        })(letterSpan, i));
        letterCell.appendChild(letterSpan);
        
        // Column 4: Finalized checkbox
        // When checked, this course's grade is locked and cannot be changed by the simulation
        let finalCell = row.insertCell(3);
        let finalCheckbox = document.createElement("input");
        finalCheckbox.type = "checkbox";
        finalCheckbox.checked = currentCourses[i].final;
        finalCheckbox.className = "final-checkbox";
        finalCheckbox.addEventListener("change", (function(index) {
            return function(e) {
                currentCourses[index].final = e.target.checked;
            };
        })(i));
        finalCell.appendChild(finalCheckbox);
    }
}

// Runs the simulation and displays the results
function runSimulationAndDisplay() {
    // Grab whatever target GPA the user entered in the input field
    currentTargetGPA = parseFloat(targetGPAInput.value);
    
    let simResult = simulateGPA(currentCourses, gradeScale, currentTargetGPA);
    let output = "";
    
    // Check if the target GPA is even possible before trying to calculate final GPA
    if (simResult.impossible === true) {
        // Just show the impossibility message
        output = formatResults(simResult, currentCourses, currentTargetGPA);
    } 
    else {
        // Calculate the resulting GPA and add it to the output
        let finalGPA = calculateGPA(simResult.results, gradeScale);
        output = formatResults(simResult, currentCourses, currentTargetGPA);
        output += "Resulting GPA: " + finalGPA.toFixed(2);
    }

    resultsOutput.innerText = output;
    inputModal.style.display = "none";
    resultsModal.style.display = "block";
}

// Formats the results to be more readable in the modal
function formatResults(results, courses, targetGPA) {
    let output = "";
    
    // First check: Is the target GPA even possible?
    // If not, just show the maximum possible GPA and stop
    if (results.impossible === true) {
        output += "\n=== CANNOT REACH TARGET GPA ===\n";
        output += "Target GPA: " + targetGPA + "\n";
        output += "Maximum possible GPA: " + results.maxPossibleGPA.toFixed(2) + "\n\n";
        return output; 
    }
    
    // If we get here, the target is achievable - extract the actual results
    results = results.results;
    
    // Group courses by credit hours (3 credit courses together, 4 credit courses together, etc.)
    // This makes the output cleaner since courses with the same credit value often get the same recommendation
    let byCredits = {};
    
    for (let i = 0; i < results.length; i++) {
        let course = results[i];
        
        // Determine if this course was locked (finalized) in the original data
        // Locked courses display their existing grade, flexible ones show recommendations
        let isLocked = false;
        for (let j = 0; j < courses.length; j++) {
            if (courses[j].name === course.name && courses[j].final === true) {
                isLocked = true;
                break;
            }
        }
        
        if (!byCredits[course.credits]) {
            byCredits[course.credits] = {
                courses: [],
                letterGrades: [],
                numericalGrades: [],
                lockedStatus: []
            };
        }
        byCredits[course.credits].courses.push(course.name);
        byCredits[course.credits].letterGrades.push(course.letterGrade);
        byCredits[course.credits].numericalGrades.push(course.grade);
        byCredits[course.credits].lockedStatus.push(isLocked);
    }
    
    output += "\n=== Required Grades to Reach GPA of " + targetGPA + " ===\n\n";
    
    // Get all the credit hour values and sort them for consistent display order
    let creditKeys = [];
    for (let key in byCredits) {
        creditKeys.push(parseFloat(key));
    }
    
    for (let c = 0; c < creditKeys.length; c++) {
        let credits = creditKeys[c];
        let group = byCredits[credits];
        
        // Split courses into locked (already set) and flexible (can be changed)
        let lockedCoursesInGroup = [];
        let flexibleIndices = [];
        
        for (let i = 0; i < group.lockedStatus.length; i++) {
            if (group.lockedStatus[i] === true) {
                lockedCoursesInGroup.push(i);
            } else {
                flexibleIndices.push(i);
            }
        }
        
        // First, display all locked courses with their existing grades
        for (let i = 0; i < lockedCoursesInGroup.length; i++) {
            let idx = lockedCoursesInGroup[i];
            output += group.courses[idx] + ": " + group.letterGrades[idx] + " (" + group.numericalGrades[idx] + ")\n";
        }
        
        // If no flexible courses in this credit group, move to the next one
        if (flexibleIndices.length === 0) {
            continue;
        }
        
        // Collect all the grades recommended for flexible courses in this group
        let flexibleGrades = [];
        let flexibleNumerical = [];
        for (let i = 0; i < flexibleIndices.length; i++) {
            let idx = flexibleIndices[i];
            flexibleGrades.push(group.letterGrades[idx]);
            flexibleNumerical.push(group.numericalGrades[idx]);
        }
        
        // Check if all flexible courses in this group need the same grade
        let allSameGrade = true;
        for (let i = 1; i < flexibleGrades.length; i++) {
            if (flexibleGrades[i] !== flexibleGrades[0]) {
                allSameGrade = false;
                break;
            }
        }
        
        // If they all need the same grade, just list each course with that grade
        if (allSameGrade) {
            for (let i = 0; i < flexibleIndices.length; i++) {
                let idx = flexibleIndices[i];
                output += group.courses[idx] + ": " + group.letterGrades[idx] + " (" + group.numericalGrades[idx] + ")\n";
            }
        }
        // If they need different grades, create a more compact summary
        else {
            // Count how many of each letter grade we need
            let uniqueGrades = [];
            let gradeCounts = [];
            let gradeNumerical = [];
            
            for (let i = 0; i < flexibleGrades.length; i++) {
                let grade = flexibleGrades[i];
                let numGrade = flexibleNumerical[i];
                let foundIndex = -1;
                
                for (let j = 0; j < uniqueGrades.length; j++) {
                    if (uniqueGrades[j] === grade) {
                        foundIndex = j;
                        break;
                    }
                }
                
                if (foundIndex !== -1) {
                    gradeCounts[foundIndex]++;
                } else {
                    uniqueGrades.push(grade);
                    gradeCounts.push(1);
                    gradeNumerical.push(numGrade);
                }
            }
            
            // Build a readable string like "2 A's (93) and 1 B (85)"
            let requirementParts = [];
            for (let i = 0; i < uniqueGrades.length; i++) {
                if (gradeCounts[i] === 1) {
                    requirementParts.push(uniqueGrades[i] + " (" + gradeNumerical[i] + ")");
                } else {
                    requirementParts.push(gradeCounts[i] + " " + uniqueGrades[i] + "'s (" + gradeNumerical[i] + ")");
                }
            }
            
            let requirementText = "";
            for (let i = 0; i < requirementParts.length; i++) {
                if (i === requirementParts.length - 1 && requirementParts.length > 1) {
                    requirementText = requirementText + " and " + requirementParts[i];
                } else if (i > 0) {
                    requirementText = requirementText + ", " + requirementParts[i];
                } else {
                    requirementText = requirementParts[i];
                }
            }
            
            // List which courses can be used to fulfill these requirements
            let flexibleCourseNames = [];
            for (let i = 0; i < flexibleIndices.length; i++) {
                let idx = flexibleIndices[i];
                flexibleCourseNames.push(group.courses[idx]);
            }
            
            let courseList = "";
            for (let i = 0; i < flexibleCourseNames.length; i++) {
                if (i === flexibleCourseNames.length - 1 && flexibleCourseNames.length > 1) {
                    courseList = courseList + " or " + flexibleCourseNames[i];
                } else if (i > 0) {
                    courseList = courseList + ", " + flexibleCourseNames[i];
                } else {
                    courseList = flexibleCourseNames[i];
                }
            }
            
            output += "You need " + requirementText + " in either " + courseList + ".\n";
        }
    }
    
    output += "\n";
    return output;
}

// When user clicks the main Simulate button, show the input modal with the course table
simulateBtn.onclick = function() {
    targetGPAInput.value = currentTargetGPA;
    populateCourseTable();
    inputModal.style.display = "block";
}

settingsBtn.onclick = function() {
    alert("Settings coming soon!");
}

// Close button handlers
closeInputBtn.onclick = function() {
    inputModal.style.display = "none";
}

closeResultsBtn.onclick = function() {
    resultsModal.style.display = "none";
}

cancelSimBtn.onclick = function() {
    inputModal.style.display = "none";
}

// This actually runs the simulation when user clicks the Run Simulation button
runSimBtn.onclick = function() {
    runSimulationAndDisplay();
}

// Back button lets user return to the edit modal after seeing results
// Their changes are preserved because we haven't reloaded the original data
backToInputBtn.onclick = function() {
    resultsModal.style.display = "none";
    inputModal.style.display = "block";
    populateCourseTable();
}

// Clicking outside either modal closes it (standard modal behavior)
window.onclick = function(event) {
    if (event.target == inputModal) {
        inputModal.style.display = "none";
    }
    if (event.target == resultsModal) {
        resultsModal.style.display = "none";
    }
}