/* 
Group Two
Dr. Porter
CSCI 3300

Mackenzie 

GradeOutcomeModal.jsx

Original simulation logic: Adam (simulationEngine.js)
React modal UI integrated with Mason's per-folder gradeScale & course data.

*/

import { useState, useEffect } from 'react';
import { requiredScoreForTarget, generateSimulation } from '../../logic/simulationEngine';
import { GradeConverter } from '../../logic/gradeConverter';
import { calculateCourseGrade } from '../../logic/gradeCalculator';
import Icon from '../../utils/Icon';
import './gpaSimulationInterface.css';

export default function GradeOutcomeModal({
    isOpen,
    onClose,
    courses = [],
    assignments = [],
    gradeScale,
}) {
    const [currentGrade, setCurrentGrade] = useState('');
    const [finalWeight, setFinalWeight] = useState('');
    const [targetGrade, setTargetGrade] = useState('');
    const [selectedCourseID, setSelectedCourseID] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState(null);

    const converter = new GradeConverter(gradeScale);

    // Reset all fields when modal opens fresh
    useEffect(() => {
        if (isOpen) {
            setCurrentGrade('');
            setFinalWeight('');
            setTargetGrade('');
            setSelectedCourseID('');
            setShowResults(false);
            setResults(null);
        }
    }, [isOpen]);

    // Autofill from a selected course
    const handleAutofill = (courseID) => {
        setSelectedCourseID(courseID);
        if (!courseID) return;

        const courseAssignments = assignments.filter(a => a.courseID === courseID);
        const ungraded = courseAssignments.filter(a => 
            a.grade === null || a.grade === undefined || a.grade === ''
        );

        if (ungraded.length === 0) {
            alert('All assignments are graded for this course — nothing left to simulate.');
            setSelectedCourseID('');
            return;
        }

        const grade = calculateCourseGrade(courseAssignments);
        if (grade !== null && grade !== undefined && grade !== '') {
            setCurrentGrade(grade.toString());
        }

        const remainingWeight = ungraded.reduce((sum, a) => sum + (a.weight || 0), 0);
        if (remainingWeight > 0) {
            setFinalWeight(remainingWeight.toString());
        }
    };

    const handleRun = () => {
        const current = parseFloat(currentGrade);
        const weight = parseFloat(finalWeight);
        const target = parseFloat(targetGrade);

        const missing = [];
        if (isNaN(current)) missing.push('Current Grade');
        if (isNaN(weight)) missing.push('Final Weight');
        if (isNaN(target)) missing.push('Target Grade');

        if (missing.length > 0) {
            alert(`Please fill in: ${missing.join(', ')}`);
        return;
    }
        const required = requiredScoreForTarget(current, weight, target);
        const simulation = generateSimulation(current, weight);

        setResults({ required, simulation, current, weight, target });
        setShowResults(true);
    };

    if (!isOpen) return null;

    const isImpossible = results && results.required > 100;
    const alreadyExceeded = results && results.required <= 0;

    return (
        <div className="sim-modal-overlay" onClick={onClose}>
            <div className="sim-modal-content" onClick={(e) => e.stopPropagation()}>
                {!showResults ? (
                    <>
                        <div className="sim-modal-header">
                            <h2>Grade Outcome Simulation</h2>
                            <button onClick={onClose} className="sim-close-btn">×</button>
                        </div>
                        <div className="sim-modal-body">
                            {courses.length > 0 && (
                                <div className="target-gpa-section">
                                    <label style={{ width: '140px' }}>Auto-fill from:</label>
                                    <select
                                        value={selectedCourseID}
                                        onChange={(e) => handleAutofill(e.target.value)}
                                        style={{
                                            padding: '8px',
                                            borderRadius: '4px',
                                            border: '1px solid #ccc',
                                            flex: 1,
                                            fontSize: '14px',
                                        }}
                                    >
                                        <option value="">— Manual entry —</option>
                                        {courses.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="target-gpa-section">
                                <label style={{ width: '140px' }}>Current Grade:</label>
                                <input
                                    type="number"
                                    value={currentGrade}
                                    onChange={(e) => setCurrentGrade(e.target.value)}
                                    placeholder="e.g. 82"
                                    className="target-gpa-input"
                                    min="0"
                                    max="100"
                                />
                                <span className="gpa-hint">% (your grade so far)</span>
                            </div>

                            <div className="target-gpa-section">
                                <label style={{ width: '140px' }}>Final Weight:</label>
                                <input
                                    type="number"
                                    value={finalWeight}
                                    onChange={(e) => setFinalWeight(e.target.value)}
                                    placeholder=" e.g. 30"
                                    className="target-gpa-input"
                                    min="0"
                                    max="100"
                                />
                                <span className="gpa-hint">% (remaining work)</span>
                            </div>

                            <div className="target-gpa-section">
                                <label style={{ width: '140px' }}>Target Grade:</label>
                                <input
                                    type="number"
                                    value={targetGrade}
                                    onChange={(e) => setTargetGrade(e.target.value)}
                                    placeholder=" e.g. 90"
                                    className="target-gpa-input"
                                    min="0"
                                    max="100"
                                />
                                <span className="gpa-hint">% (course grade you want)</span>
                            </div>

                            <div className="sim-modal-buttons">
                                <button onClick={onClose} className="btn-secondary">Cancel</button>
                                <button onClick={handleRun} className="btn-primary">Run Simulation</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="sim-modal-header">
                            <h2>Grade Outcome Results</h2>
                            <button onClick={onClose} className="sim-close-btn">×</button>
                        </div>
                        <div className="sim-modal-body">
                            {isImpossible ? (
                                <div className="results-card impossible">
                                    <div className="results-icon">
                                        <Icon name="warning" size={48} color="white" />
                                    </div>
                                    <h3>Target Unreachable</h3>
                                    <p style={{ textAlign: 'center', marginTop: '16px' }}>
                                        Even a perfect 100% on the remaining {results.weight}% would only get you to{' '}
                                        <strong>{(results.current + 100 * (results.weight / 100)).toFixed(2)}%</strong>.
                                    </p>
                                    <p style={{ textAlign: 'center', marginTop: '8px' }}>
                                        You'd need <strong>{results.required}%</strong> to hit your target of {results.target}%.
                                    </p>
                                </div>
                            ) : alreadyExceeded ? (
                                <div className="results-card success">
                                    <div className="results-icon">
                                        <Icon name="target" size={48} color="white" />
                                    </div>
                                    <h3>You've Already Exceeded Your Target!</h3>
                                    <p style={{ textAlign: 'center', marginTop: '16px' }}>
                                        Any score on the remaining {results.weight}% will keep you at or above {results.target}%.
                                    </p>
                                </div>
                            ) : (
                                <div className="results-card success">
                                    <div className="results-icon">
                                        <Icon name="target" size={48} color="white" />
                                    </div>
                                    <h3>You Need {results.required}% ({converter.percentageToLetter(results.required)})</h3>
                                    <p style={{ textAlign: 'center', marginTop: '8px', marginBottom: '16px' }}>
                                        on the remaining {results.weight}% to reach a {results.target}% course grade.
                                    </p>

                                    <div className="results-list">
                                        <div className="result-item" style={{ fontWeight: '600', borderBottom: '2px solid rgba(255,255,255,0.4)' }}>
                                            <span className="result-name">If you score:</span>
                                            <span className="result-grade">Final grade:</span>
                                        </div>
                                        {results.simulation.map((sim, idx) => (
                                            <div key={idx} className="result-item">
                                                <span className="result-name">
                                                    {sim.score}% ({converter.percentageToLetter(sim.score)})
                                                </span>
                                                <span className="result-grade">
                                                    {sim.final}% ({converter.percentageToLetter(sim.final)})
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
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