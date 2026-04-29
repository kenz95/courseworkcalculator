/* 
Group Two 
CSCI 3300 
Dr. Porter 
Spring 2026 

models/index.js 

Core data modesl for the Coursework tracekr & GPA Calculator 

Using Plain JS Objects 
Mirroring the SQL Tables

*/ 

/* 

CREATE INSTITUITONS 

*/ 

export function createInstitution(overrides = {}) {
    return {
        id: uuidv4(),
        name:   '',                                   // EX: University of North Georgia 
        gpa:    '4.0',                               // EX: 4.0 standard,  4.3 for A+, or custom
        gradeScale: {                               // Minimum percentage needed for each grade 
            A: 90, 
            B: 80, 
            C: 70, 
            D: 60, 
            F: 0, 
        }, 
        
        createdAt: new Date().toISOString(),     // Add current date when created 
        ...overrides,
    }; 
} 

/* 

CREATE FOLDERS 

*/ 

export function createFolder(overrides = {}){
    return {
        id: uuidv4(),
        name:   '',                             // EX: Spring 2026 or Fall 2027 
        institutionID:  null,                   // OPTIONAL FK: for multi institution use cases
        createdAt: new Date().toISOString(),    // Add current date when created 
        ...overrides,
    }; 
}


/* 

CREATE COURSE

*/ 

export function createCourse(overrides = {}){
    return {

        id: uuidv4(),
        folderID: null,                         // REQUIRED FK: which course belong to which folder
        institutionID:  null,                   // OPTIONAL FK: for multi institution use cases 
        name: '',                               // EX: CSCI 3330 or Numerical Analysis 
        creditHours: 3,                         // Default & Used for GPA 
        color: '#6366f1',                     // UI accent color
        createdAt: new Date().toISOString(),
        ...overrides,

    };

}

/* 

CREATE ASSIGNMENT 

*/ 

export function createAssignment(overrides = {}) {
    return {
        id: uuidv4(),
        courseID: null,                         // REQUIRED FK: Which course it belongs to 
        name: '',                               // EX: Discussion 10 or Lab Report 2
        category: '',                           // EX: Homework, Quiz, or Lab 
        weight: 0,                              // Percentage of grade
        grade: null,                            // OPTIONAL: not graded yet or null 
        dueDate: null,                          // ISO String or null 
        notes: '',                              // OPTIONAL: notes about assignment if needed 
        isDropped: false,                       // IF the grade gets dropped or not 
        createdAt: new Date().toISOString(), 
        ...overrides,  
    }; 
} 

/* 

SIMULATION RESULT 

Not stored in DB but is computed using the simuation engine and displayed in the presentation

*/ 

export function createSimulationResult(overrides ={}){
    return{
        courseID: null, 
        targetGrade: null,                    // User's chosen target grade goal 
        currentGrade: null,                   // User's calculated grade from uplaoded assignments
        requiredScores: [],                   // AssignmentID & Name 
        isAchieveable: true,                  // False if mathematically impossible 
        minimumAvgNeeded: null,               // Single avg needed across all ungraded
        ...overrides, 
    };
}

/* 

CREATE ALERT 

Shown in presentation layer & generated in logic 

*/ 

export function createdAlert(overrides ={}) {
    return {
        id: uuidv4(),
        type: 'warning',                    // Types are warning, error, info, or success 
        message: '',                        // EX: Warning! Grade is falling below goal! 
        courseID: null,                     // OPTIONAL FK: linking to specific course
        isDismissed: false, 
        createdAt: new Date().toISOString(), 
        ...overrides,
    };
}  

/* 

CREATE APP STATE 

This is linked to the local storage and is what will be seralized to it 

*/ 

export function createInitialAppState() {
    return {    
    
        institutions: [],
        folders: [], 
        courses: [], 
        assignments: [], 
        alerts: [], 
        settings: {
            theme: 'dark',                      // Default to Dark Theme, but offer light 
            defaultGPAScale: '4.0', 
            lastViewedFolderID: null,           // Shows what folder was seen last by the User or not 
        } 
    };
}
