/* 

Group Two
Dr. Porter
CSCI 3300 

gpaSimulationInterface.jsx 

Mason 

*/

/* components/simulation/gpaSimulationInterface.jsx - GPA simulation modal */

import { useState, useEffect } from 'react';
import { simulateGPA, formatSimulationResults } from "../../logic/gpaSimulationEngine";
import { getDefaultGradeScale } from '../../logic/gradeCalculator';
import './gpaSimulationInterface.css';
import Icon from '../../utils/Icon';

export default function GpaSimulation({ 
    isOpen, 
    onClose,
    courses,
    gradeScale,
    targetGPA,
    onSaveSimulation,
    onUpdateGradeScale
}) {
    const [currentCourses, setCurrentCourses] = useState([]);
    const [currentTargetGPA, setCurrentTargetGPA] = useState(targetGPA || 3.0);
    const [showResults, setShowResults] = useState(false);
    const [simulationResults, setSimulationResults] = useState(null);
    const [activeGradeScale, setActiveGradeScale] = useState(gradeScale || getDefaultGradeScale());

    // When the modal opens, copy the courses so the user can edit them without affecting the original data
    useEffect(() => {
        if (isOpen && courses) {
            setCurrentCourses(JSON.parse(JSON.stringify(courses.map(c => ({
                name: c.name,
                grade: c.grade || 0,
                credits: c.credits || 3,
                final: c.final || false,
                id: c.id
            })))));
            setShowResults(false);
            setSimulationResults(null);
        }
    }, [isOpen, courses]);

    const handleRunSimulation = () => {
        const result = simulateGPA(currentCourses, activeGradeScale, currentTargetGPA);
        const formatted = formatSimulationResults(result, currentCourses, currentTargetGPA, activeGradeScale);
        setSimulationResults(formatted);
        setShowResults(true);
    };

    const handleCourseChange = (index, field, value) => {
        const updated = [...currentCourses];
        updated[index][field] = value;
        if (field === 'grade') {
            updated[index].grade = parseInt(value) || 0;
        }
        if (field === 'final') {
            updated[index].final = value;
        }
        setCurrentCourses(updated);
    };

    const getLetterGrade = (grade) => {
        return activeGradeScale.find(item => grade >= item.min)?.letter || "F";
    };

    if (!isOpen) return null;

    return (
        <div className="sim-modal-overlay" onClick={onClose}>
            <div className="sim-modal-content sim-modal-large" onClick={(e) => e.stopPropagation()}>
                {!showResults ? (
                    // Input modal - user edits grades and marks which courses are locked
                    <>
                        <div className="sim-modal-header">
                            <h2>GPA Simulation</h2>
                            <button onClick={onClose} className="sim-close-btn">&times;</button>
                        </div>
                        <div className="sim-modal-body">
                            <div className="target-gpa-section">
                                <label>Target GPA:</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="4.0"
                                    value={currentTargetGPA}
                                    onChange={(e) => setCurrentTargetGPA(parseFloat(e.target.value) || 0)}
                                    className="target-gpa-input"
                                />
                                <span className="gpa-hint">(0.0 - 4.0)</span>
                            </div>

                            <p>Edit grades and mark which courses are finalized (locked):</p>
                            <div className="table-container">
                                <table className="sim-course-table">
                                    <thead>
                                        <tr>
                                            <th>Course Name</th>
                                            <th>Numerical Grade</th>
                                            <th>Letter Grade</th>
                                            <th>Credits</th>
                                            <th>Finalized</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentCourses.map((course, idx) => (
                                            <tr key={course.id || idx}>
                                                <td className="course-name">{course.name}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        value={course.grade}
                                                        onChange={(e) => handleCourseChange(idx, 'grade', e.target.value)}
                                                        className="grade-input"
                                                        min="0"
                                                        max="100"
                                                    />
                                                </td>
                                                <td>
                                                    <span className="letter-grade">{getLetterGrade(course.grade)}</span>
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        value={course.credits}
                                                        onChange={(e) => handleCourseChange(idx, 'credits', parseInt(e.target.value) || 0)}
                                                        className="credit-input"
                                                        min="1"
                                                        max="6"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={course.final}
                                                        onChange={(e) => handleCourseChange(idx, 'final', e.target.checked)}
                                                        className="final-checkbox"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="sim-modal-buttons">
                                <button onClick={onClose} className="btn-secondary">Cancel</button>
                                <button onClick={handleRunSimulation} className="btn-primary">Run Simulation</button>
                            </div>
                        </div>
                    </>
                ) : (
                    // Results modal - shows what grades they need
                    <>
                        <div className="sim-modal-header">
                            <h2>GPA Simulation Results</h2>
                            <button onClick={onClose} className="sim-close-btn">&times;</button>
                        </div>
                        <div className="sim-modal-body">
                            {simulationResults?.impossible ? (
                                <div className="results-card impossible">
                                    <div className="results-icon">
                                        <Icon name="warning" size={48} color="white" />
                                    </div>
                                    <h3>Cannot Reach Target GPA</h3>
                                    <p>Target GPA: <strong>{simulationResults.target}</strong></p>
                                    <p>Maximum possible GPA: <strong>{simulationResults.maxPossibleGPA?.toFixed(2)}</strong></p>
                                </div>
                            ) : (
                                <>
                                    <div className="results-card success">
                                        <div className="results-icon">
                                            <Icon name="target" size={48} color="white" />
                                         </div>
                                        <h3>Required Grades to Reach GPA of {simulationResults.target}</h3>

                                        <div className="results-list">
                                            {simulationResults.items?.map((item, idx) => {
                                                if (item.type === 'locked') {
                                                    return (
                                                        <div key={idx} className="result-item locked">
                                                            <span className="result-name">{item.name}</span>
                                                            <span className="result-grade">
                                                                {item.grade} {item.letter}
                                                                <span className="locked-badge">[Final]</span>
                                                            </span>
                                                        </div>
                                                    );
                                                } else if (item.type === 'flexible') {
                                                    return (
                                                        <div key={idx} className="result-item">
                                                            <span className="result-name">{item.name}</span>
                                                            <span className="result-grade">{item.grade} {item.letter}</span>
                                                        </div>
                                                    );
                                                } else if (item.type === 'distribution') {
                                                    return (
                                                        <div key={idx} className="result-item distribution">
                                                            <span className="result-name"></span>
                                                            <span className="result-grade">{item.text}</span>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                        
                                        <div className="results-footer">
                                            <div className="final-gpa">
                                                <span style={{ marginRight: '10px', verticalAlign: 'center' }}>
                                                    <Icon name="trending-up" size={40} color="white" />
                                                </span>
                                                Resulting GPA: <strong>{simulationResults.finalGPA}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="sim-modal-buttons">
                                <button onClick={() => setShowResults(false)} className="btn-secondary">Back to Edit</button>
                                <button onClick={onClose} className="btn-primary">Close</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
