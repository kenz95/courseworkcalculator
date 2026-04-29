/* 

Group Two
Dr. Porter
CSCI 3300 

Mason

*/

/* App.jsx - Main Dashboard component - controls which view (semesters/courses/assignments) is shown */

import { useState } from 'react';
import FolderManager from './components/folders/FolderManager';
import CourseList from './components/courses/CourseList';
import AssignmentList from './components/assignments/AssignmentList';
import WeightModal from './components/assignments/WeightModal';
import SimulationInterface from './components/simulation/gpaSimulationInterface';
import AlertsList from './components/alerts/AlertsList';
import GradeScalingModal from './components/folders/GradeScalingModal';
import { calculateSemesterGPA } from './logic/gpaCalculator';
import { calculateCourseGrade } from './logic/gradeCalculator';
import './App.css';

export default function App({ 
    folders = [],        
    courses = [], 
    assignments = [],
    onAddFolder,
    onUpdateFolder,
    onDeleteFolder,
    onAddCourse,
    onUpdateCourse,
    onDeleteCourse,
    onAddAssignment,
    onUpdateAssignment,
    onDeleteAssignment
}) {
    // Navigation state - tracks which screen we're on and what's selected
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [view, setView] = useState('semesters'); // 'semesters', 'courses', or 'assignments'
    
    // Modal visibility states
    const [showWeightModal, setShowWeightModal] = useState(false);
    const [showGpaSim, setShowGpaSim] = useState(false);
    const [showScaleModal, setShowScaleModal] = useState(false);
    
    // Grade scale for the currently selected semester. Starts with the default +/- scale.
    const [semesterGradeScale, setSemesterGradeScale] = useState([
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
    ]);

    // Helper variables to make the render logic cleaner
    const semesterCourses = courses.filter(c => c.folderID === selectedFolderId);
    const courseAssignments = assignments.filter(a => a.courseID === selectedCourseId);
    const currentCourse = courses.find(c => c.id === selectedCourseId);
    const currentFolder = folders.find(f => f.id === selectedFolderId);

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

    // Wrapper functions that create the right object shape for the callbacks
    const handleAddSemester = () => {
        onAddFolder({ name: `Semester ${folders.length + 1}` });
    };

    const handleAddCourseWrapper = () => {
        const newCourse = {
            name: `Course ${semesterCourses.length + 1}`,
            folderID: selectedFolderId,
            creditHours: 3,
            color: '#' + Math.floor(Math.random() * 16777215).toString(16)
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
            <div className="container">
                <h1 className="title">Coursework Tracker & GPA Calculator</h1>
                
                <div className="section">
                    <div className="section-header">
                        <h2 className="section-title">Semesters</h2>
                        <button onClick={handleAddSemester} className="add-button">+ Add Semester</button>
                    </div>
                    <FolderManager
                        folders={folders}
                        courses={courses}
                        assignments={assignments}
                        gradeScale={semesterGradeScale}
                        onOpenSemester={handleOpenSemester}
                        onEditFolder={onUpdateFolder}
                        onDeleteFolder={onDeleteFolder}
                    />
                    <AlertsList 
                         alerts={[]} 
                        onDismiss={() => {}} 
                    />
                </div>
            </div>
        );
    }

    // ========== COURSES VIEW (inside a semester) ==========
    if (view === 'courses') {
        const semesterGPA = calculateSemesterGPA(semesterCourses, assignments, semesterGradeScale);
        
        return (
            <div className="container">
                <button onClick={handleBackToSemesters} className="back-button">← Back to Semesters</button>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <h1 className="title" style={{ marginBottom: 0 }}>{currentFolder?.name}</h1>
                        {semesterGPA !== null && (
                            <div style={{ 
                                backgroundColor: '#6366f1', 
                                color: 'white', 
                                padding: '8px 16px', 
                                borderRadius: '8px',
                                fontSize: '18px',
                                fontWeight: '600',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span>📊</span>
                                <span>GPA: {semesterGPA}</span>
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                            onClick={() => setShowScaleModal(true)} 
                            className="settings-button"
                        >
                            ⚙️ Scaling
                        </button>
                        <button 
                            onClick={() => setShowGpaSim(true)} 
                            className="add-button"
                        >
                            📊 GPA Simulation
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
                    onUpdateGradeScale={setSemesterGradeScale}
                />

                <GradeScalingModal
                    isOpen={showScaleModal}
                    onClose={() => setShowScaleModal(false)}
                    currentScale={semesterGradeScale}
                    onSave={(newScale) => {
                        setSemesterGradeScale(newScale);
                        console.log('Saved scale for semester', currentFolder?.name, newScale);
                    }}
                    semesterName={currentFolder?.name}
                />
            </div>
        );
    }

    // ========== ASSIGNMENTS VIEW (inside a course) ==========
    if (view === 'assignments') {
        const courseGrade = calculateCourseGrade(courseAssignments);
        
        return (
            <div className="container">
                <button onClick={handleBackToCourses} className="back-button">← Back to Courses</button>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <h1 className="title" style={{ marginBottom: 0 }}>{currentCourse?.name}</h1>
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
                            <span>📝</span>
                            <span>Grade: {courseGrade}%</span>
                        </div>
                    )}
                </div>
                
                <div className="section">
                    <AssignmentList
                        assignments={courseAssignments}
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
        );
    }

    return null;
}