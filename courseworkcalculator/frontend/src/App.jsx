/* 

Group Two
Dr. Porter
CSCI 3300 

Mason & 
Edits by Mackenzie for formatting, imports & connecting all team member's code

*/

/* App.jsx - Main Dashboard component - controls which view (semesters/courses/assignments) is shown */

import { useState } from 'react';
import Dashboard from './components/layout/Dashboard';
import FolderManager from './components/folders/FolderManager';
import CourseList from './components/courses/CourseList';
import AssignmentList from './components/assignments/AssignmentList';
import WeightModal from './components/assignments/WeightModal';
import SimulationInterface from './components/simulation/gpaSimulationInterface';
import AlertsList from './components/alerts/AlertsList';
import GradeScalingModal from './components/folders/GradeScalingModal';
import GradeOutcomeModal from './components/simulation/GradeOutcomeModal';
import Icon from './utils/Icon';
import InstitutionDashboard from './components/institutions/InstitutionDashboard';
import { exportToJSON, importFromJSON } from './data/localStorageManager';
import { exportToTXT, exportToPDF } from './components/settings/ImportExport';
import { calculateSemesterGPA } from './logic/gpaCalculator';
import { calculateCourseGrade } from './logic/gradeCalculator';
import { COURSE_COLORS } from './utils/courseColors';

import './App.css';


export default function App({ 
    folders = [],        
    courses = [], 
    assignments = [],
    institutions = [],
    alerts = [],
    onDismissAlert,
    onImport,
    onResetAll,
    onAddFolder,
    onUpdateFolder,
    onDeleteFolder,
    onAddCourse,
    onUpdateCourse,
    onDeleteCourse,
    onAddAssignment,
    onUpdateAssignment,
    onDeleteAssignment,
    onAddInstitution,
    onUpdateInstitution,
    onDeleteInstitution,

}) {
    // Navigation state - tracks which screen we're on and what's selected
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [view, setView] = useState('semesters'); // 'semesters', 'courses', 'assignments', or 'institutions'

    const [showWeightModal, setShowWeightModal] = useState(false);
    const [showGpaSim, setShowGpaSim] = useState(false);
    const [showScaleModal, setShowScaleModal] = useState(false);
    const [showOutcomeModal, setShowOutcomeModal] = useState(false);
    
    // Helper variables to make the render logic cleaner
    const semesterCourses = courses.filter(c => c.folderID === selectedFolderId);
    const courseAssignments = assignments.filter(a => a.courseID === selectedCourseId);
    const currentCourse = courses.find(c => c.id === selectedCourseId);
    const currentFolder = folders.find(f => f.id === selectedFolderId);

    // Grade scale for the currently selected semester. Starts with the default +/- scale.
    const semesterGradeScale = currentFolder?.gradeScale || [
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
    
    // Navigation functions - move between screens
    const handleOpenSemester = (folderId) => {
        setSelectedFolderId(folderId);
        setSelectedCourseId(null);
        setView('courses');
    };

    const handleOpenCourse = (courseId) => {
        setSelectedCourseId(courseId);
        setView('assignments');
    };

    const handleBackToSemesters = () => {
        setView('semesters');
        setSelectedFolderId(null);
        setSelectedCourseId(null);
    };
    

    const handleBackToCourses = () => {
        setView('courses');
        setSelectedCourseId(null);
    };

    // Handler for Institutes
    const handleOpenInstitutions = () => {
    setView('institutions');
    setSelectedFolderId(null);
    setSelectedCourseId(null);  
    };

    // Wrapper functions that create the right object shape for the callbacks
    const handleAddSemester = () => {
        onAddFolder({ name: `Semester ${folders.length + 1}` });
    };

    const handleAddCourseWrapper = () => {
        const newCourse = {
            name: `Course ${semesterCourses.length + 1}`,
            folderID: selectedFolderId,
            creditHours: 3,
            color: COURSE_COLORS[semesterCourses.length % COURSE_COLORS.length]
        };
        onAddCourse(newCourse);
    };  

    const handleAddAssignmentWrapper = () => {
        const newAssignment = {
            name: `Assignment ${courseAssignments.length + 1}`,
            courseID: selectedCourseId,
            category: '',
            weight: 0,
            grade: null
        };
        onAddAssignment(newAssignment);
    };

    // Handles clicks on search results — same logic regardless of which view we're on.
    // Navigates by walking up the parent chain: assignment -> course -> semester.
    const handleSelectSearchResult = (result) => {
       
        if (result.type === 'Semester') {
            handleOpenSemester(result.id);
            return;
        }
    
        if (result.type === 'Course') {
            const course = courses.find(c => c.id === result.id);
            if (course) {
                handleOpenSemester(course.folderID);
                setTimeout(() => handleOpenCourse(result.id), 100);
            }

            return;
        }
    
        if (result.type === 'Assignment') {
            const assignment = assignments.find(a => a.id === result.id);
                if (!assignment) return;
        
                const course = courses.find(c => c.id === assignment.courseID);
                if (!course) return;
        
                handleOpenSemester(course.folderID);
                setTimeout(() => handleOpenCourse(course.id), 100);

                // The assignment lives on the course page, which is now open
        }  
    };  

    // Resets all data and navigates back to the semesters view so the user doesn't end up looking at a deleted course
    const handleResetAndNavigate = () => {

         handleBackToSemesters();
        if (onResetAll) onResetAll();
    };

    // Prepares course data for the GPA simulation modal
    const getCoursesForSimulation = () => {
        return semesterCourses.map(course => {
            const courseAssignmentsList = assignments.filter(a => a.courseID === course.id);
            
            let currentGrade = null;
            if (courseAssignmentsList.length > 0) {
                let totalWeight = 0;
                let weightedSum = 0;
                for (const assignment of courseAssignmentsList) {
                    if (assignment.grade !== null && assignment.weight) {
                        totalWeight += assignment.weight;
                        weightedSum += (assignment.grade * assignment.weight);
                    }
                }
                if (totalWeight > 0) {
                    currentGrade = weightedSum / totalWeight;
                }
            }
            
            return {
                id: course.id,
                name: course.name,
                grade: currentGrade || 0,
                credits: course.creditHours || 3,
                final: false,
            };
        });
    };

    // ========== SEMESTERS VIEW ==========
    if (view === 'semesters') {
        return (
            <>
                <Dashboard
                    courses={courses}
                    assignments={assignments}
                    folders={folders}
                    onBackToHome={handleBackToSemesters}
                    onExportJSON={() => exportToJSON({ courses, assignments, folders })}
                    onExportTXT={() => exportToTXT({ courses, assignments, folders })}
                    onExportPDF={() => exportToPDF({ courses, assignments, folders })}
                    onImport={(file) => importFromJSON(file).then(onImport)}
                    onSelectResult={handleSelectSearchResult} 
                    onOpenInstitutions={handleOpenInstitutions}
                    onResetAll={handleResetAndNavigate}
                />

            <div className="container">
                <h1 className="title"> 
                    <span style={{ marginRight: '12px', verticalAlign: 'center' }}>
                           <Icon name="book" size={28} color="dark" />
                    </span>
                        Coursework Tracker & GPA Calculator 
                </h1>
                
                <div className="section">
                    <div className="section-header">
                        <h2 className="section-title">Semesters</h2>
                        <div style={{ display: 'flex', gap: '10px' }}>
                             {(institutions.length > 0 || folders.some(f => f.institutionID)) && (
                                <button onClick={handleOpenInstitutions} className="settings-button"
                                    style={{
                                        display:    'flex',
                                        alignItems: 'center',
                                        gap:        '6px',
                                    }}
                                >
                                     <Icon name="building" size={14} color="white" />
                                         Institutions
                                </button>
                             )}
                            <button onClick={handleAddSemester} className="add-button">+ Add Semester</button>
                        </div>
                 </div>

                    <FolderManager
                        folders={folders}
                        courses={courses}
                        assignments={assignments}
                        institutions={institutions}
                        gradeScale={semesterGradeScale}
                        onOpenSemester={handleOpenSemester}
                        onEditFolder={onUpdateFolder}
                        onDeleteFolder={onDeleteFolder}
                    />
                    <AlertsList
                        alerts={alerts}
                        onDismiss={onDismissAlert}
                    />

                </div>
            </div>
        </>
        );
    }

    // ========== COURSES VIEW (inside a semester) ==========
    if (view === 'courses') {
        const semesterGPA = calculateSemesterGPA(semesterCourses, assignments, semesterGradeScale);
        
        return (
            <> 
                <Dashboard
                    courses={courses}
                    assignments={assignments}
                    folders={folders}
                    onBackToHome={handleBackToSemesters}
                    onExportJSON={() => exportToJSON({ courses, assignments, folders })}
                    onExportTXT={() => exportToTXT({ courses, assignments, folders })}
                    onExportPDF={() => exportToPDF({ courses, assignments, folders })}
                    onImport={(file) => importFromJSON(file).then(onImport)}
                    onSelectResult={handleSelectSearchResult}  
                    onOpenInstitutions={handleOpenInstitutions}
                    onResetAll={handleResetAndNavigate}
                />

            <div className="container">
               <button onClick={handleBackToSemesters}
                    className="back-button"
                    style={{
                        display:      'flex',
                        alignItems:   'center',
                        gap:          '6px',
                    }}
                >
                    <Icon name="back" size={14} color="white" />
                    Back to Semesters
                </button>
                
                <div className="title-row" style={{ 

                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        gap: '12px', 
                        flexWrap: 'wrap' 
                    }}>

                    <div style={{ 

                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            flexWrap: 'wrap' 
                        }}>
                        <h1 className="title" style={{ 
                            marginBottom: 0,
                            marginTop:    0, 
                            paddingBottom: 0, 
                            borderBottom: 'none',
                            lineHeight: '1',
                        }}>
                            {currentFolder?.name}
                        </h1>
                        {semesterGPA !== null && (
                            <div style={{ 
                                backgroundColor: '#6366f1', 
                                color: 'white', 
                                padding: '8px 16px', 
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                whiteSpace: 'nowrap',
                        }}>
                                <span><Icon name="chart" size={18} color="white" /></span>
                                <span>GPA: {semesterGPA}</span>
                            </div>
                        )}
                    </div>
                    <div style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            alignItems: 'center'
                        }}>
                        <button onClick={() => setShowScaleModal(true)}
                         className="settings-button"
                            style={{
                                display:    'flex',
                                alignItems: 'center',
                                gap:        '6px',
                            }}
                        >
                            <Icon name="settings" size={14} color="white" />
                                Scaling
                        </button>
                        <button onClick={() => setShowOutcomeModal(true)} 
                            className="add-button"
                                style={{
                                    display:    'flex',
                                    alignItems: 'center',
                                    gap:        '6px',
                            }}
                        >
                            <Icon name="target" size={14} color="white" /> 
                                Grade Outcome Simulation
                        </button>
                        <button onClick={() => setShowGpaSim(true)}
                            className="add-button"
                            style={{
                                display:    'flex',
                                alignItems: 'center',
                                gap:        '6px',
                            }}
                        >
                             <Icon name="chart" size={14} color="white" />
                                GPA Simulation
                        </button>
                    </div>
                </div>
                
                <div className="section">
                    <div className="section-header">
                        <h2 className="section-title">Courses</h2>
                        <button onClick={handleAddCourseWrapper} className="add-button">+ Add Course</button>
                    </div>
                    <CourseList
                        courses={semesterCourses}
                        assignments={assignments}
                        gradeScale={semesterGradeScale}
                        onOpenCourse={handleOpenCourse}
                        onEditCourse={onUpdateCourse}
                        onDeleteCourse={onDeleteCourse}
                    />
                </div>

                {/* Modals */}
                <SimulationInterface
                    isOpen={showGpaSim}
                    onClose={() => setShowGpaSim(false)}
                    courses={getCoursesForSimulation()}
                    gradeScale={semesterGradeScale}
                    targetGPA={3.0}
                    onSaveSimulation={(results) => {
                        console.log('Simulation results:', results);
                    }}
                    onUpdateGradeScale={(newScale) => {
                        if (selectedFolderId) {
                            onUpdateFolder(selectedFolderId, { gradeScale: newScale });
                        }
                    }}
                />

                <GradeOutcomeModal
                    isOpen={showOutcomeModal}
                    onClose={() => setShowOutcomeModal(false)}
                    courses={semesterCourses}
                    assignments={assignments}
                    gradeScale={semesterGradeScale}
                />

                <GradeScalingModal
                    isOpen={showScaleModal}
                    onClose={() => setShowScaleModal(false)}
                    currentScale={semesterGradeScale}
                    onSave={(newScale) => {
                        if (selectedFolderId) {
                            onUpdateFolder(selectedFolderId, { gradeScale: newScale });
                        }
                    }}
                    semesterName={currentFolder?.name}
                />
            </div>
        </> 
        );
    }

    // ========== ASSIGNMENTS VIEW (inside a course) ==========
    if (view === 'assignments') {
        const courseGrade = calculateCourseGrade(courseAssignments);
        
        return (
            <> 
                <Dashboard
                    courses={courses}
                    assignments={assignments}
                    folders={folders}
                    onBackToHome={handleBackToSemesters}
                    onExportJSON={() => exportToJSON({ courses, assignments, folders })}
                    onExportTXT={() => exportToTXT({ courses, assignments, folders })}
                    onExportPDF={() => exportToPDF({ courses, assignments, folders })}
                    onImport={(file) => importFromJSON(file).then(onImport)}
                    onSelectResult={handleSelectSearchResult}  
                    onOpenInstitutions={handleOpenInstitutions}
                    onResetAll={handleResetAndNavigate}
                />

            <div className="container">
                <button onClick={handleBackToCourses}
                    className="back-button"
                    style={{
                        display:    'flex',
                        alignItems: 'center',
                        gap:        '6px',
                    }}
                >
                    <Icon name="back" size={14} color="white" />
                        Back to Courses
                </button>
                
                <div className="title-row" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '16px', 
                        flexWrap: 'wrap' 
                    }}>
                    <h1 className="title" style={{ 
                            marginBottom: 0, 
                            marginTop: 0,
                            paddingBottom: 0,
                            borderBottom: 'none',
                            lineHeight: '1',
                        }}>
                            {currentCourse?.name}</h1>
                    {courseGrade && (
                        <div style={{ 
                            backgroundColor: currentCourse?.color || '#6366f1', 
                            color: 'white', 
                            padding: '8px 16px', 
                            borderRadius: '8px',
                            fontSize: '18px',
                            fontWeight: '600',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span><Icon name="grade" size={18} color="white" /></span>
                            <span>Grade: {courseGrade}%</span>
                        </div>
                    )}
                </div>
                
                <div className="section">
                    <AssignmentList
                        assignments={courseAssignments}
                        gradeScale={semesterGradeScale}
                        onUpdateAssignment={onUpdateAssignment}
                        onDeleteAssignment={onDeleteAssignment}
                        onAddAssignment={handleAddAssignmentWrapper}
                        onOpenWeightModal={() => setShowWeightModal(true)}
                    />
                </div>

                {/* Weight Modal */}
                <WeightModal
                    isOpen={showWeightModal}
                    onClose={() => setShowWeightModal(false)}
                    assignments={courseAssignments}
                    onUpdateAssignment={onUpdateAssignment}
                    courseName={currentCourse?.name}
                />
            </div>
         </>
        );
    }

    // ========== INSTITUTIONS VIEW ==========
    // Mirroring the previous views & connecting Angie's Institute.jsx
    if (view === 'institutions') {
        return (
            <>
                <Dashboard
                    courses={courses}
                    assignments={assignments}
                    folders={folders}
                    onBackToHome={handleBackToSemesters}
                    onExportJSON={() => exportToJSON({ courses, assignments, folders, institutions })}
                    onExportTXT={() => exportToTXT({ courses, assignments, folders })}
                    onExportPDF={() => exportToPDF({ courses, assignments, folders })}
                    onImport={(file) => importFromJSON(file).then(onImport)}
                    onSelectResult={handleSelectSearchResult}
                    onOpenInstitutions={handleOpenInstitutions}
                    onResetAll={onResetAll}
                />

                <div className="container">
                    <button onClick={handleBackToSemesters}
                        className="back-button"
                        style={{
                            display:    'flex',
                            alignItems: 'center',
                            gap:        '6px',
                        }}
                    >
                        <Icon name="back" size={14} color="white" />
                        Back to Semesters
                    </button>

                   <InstitutionDashboard
                        institutions={institutions}
                        folders={folders}
                        courses={courses}
                        assignments={assignments}
                        gradeScale={semesterGradeScale}
                        onAddInstitution={onAddInstitution}
                        onUpdateInstitution={onUpdateInstitution}
                        onDeleteInstitution={onDeleteInstitution}
                        onOpenSemester={handleOpenSemester}
                    />
                </div>
            </>
        );
    }

    return null;
}