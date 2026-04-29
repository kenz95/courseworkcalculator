/* 

Group Two
Dr. Porter
CSCI 3300 

GradeScalingModal.jsx 

Mason

*/



/* components/folders/GradeScalingModal.jsx - Grade scale editor for individual semesters */

import { useState, useEffect } from 'react';

export default function GradeScalingModal({ 
    isOpen, 
    onClose, 
    currentScale, 
    onSave,
    semesterName 
}) {
    const [usePlusMinus, setUsePlusMinus] = useState(true);
    const [includeD, setIncludeD] = useState(true);
    const [localScale, setLocalScale] = useState([]);

    // Generates a default scale based on the two toggle options
    // Had to write this out manually because the mapping between grades and numbers isn't algorithmic
    const getStandardScale = (withPlusMinus, withD) => {
        if (withPlusMinus) {
            let scale = [
                { min: 93, points: 4.0, letter: "A" },
                { min: 90, points: 3.7, letter: "A-" },
                { min: 87, points: 3.3, letter: "B+" },
                { min: 83, points: 3.0, letter: "B" },
                { min: 80, points: 2.7, letter: "B-" },
                { min: 77, points: 2.3, letter: "C+" },
                { min: 73, points: 2.0, letter: "C" },
                { min: 70, points: 1.7, letter: "C-" },
            ];
            if (withD) {
                scale.push(
                    { min: 67, points: 1.3, letter: "D+" },
                    { min: 63, points: 1.0, letter: "D" },
                    { min: 60, points: 0.7, letter: "D-" }
                );
            }
            scale.push({ min: 0, points: 0.0, letter: "F" });
            return scale;
        } else {
            // Simpler version without plus/minus
            let scale = [
                { min: 90, points: 4.0, letter: "A" },
                { min: 80, points: 3.0, letter: "B" },
                { min: 70, points: 2.0, letter: "C" },
            ];
            if (withD) {
                scale.push({ min: 60, points: 1.0, letter: "D" });
            }
            scale.push({ min: 0, points: 0.0, letter: "F" });
            return scale;
        }
    };

    // When the modal opens, load the existing scale or create a fresh one
    useEffect(() => {
        if (isOpen && currentScale && currentScale.length > 0) {
            setLocalScale(JSON.parse(JSON.stringify(currentScale)));
            // Figure out if the current scale has plus/minus grades
            const hasPlusMinus = currentScale.some(g => g.letter.includes('+') || g.letter.includes('-'));
            setUsePlusMinus(hasPlusMinus);
            // Figure out if D grades exist
            const hasD = currentScale.some(g => g.letter === 'D' || g.letter === 'D+' || g.letter === 'D-');
            setIncludeD(hasD);
        } else if (isOpen) {
            const defaultScale = getStandardScale(true, true);
            setLocalScale(defaultScale);
            setUsePlusMinus(true);
            setIncludeD(true);
        }
    }, [isOpen, currentScale]);

    const handleUsePlusMinusChange = (checked) => {
        setUsePlusMinus(checked);
        const newScale = getStandardScale(checked, includeD);
        setLocalScale(newScale);
    };

    const handleIncludeDChange = (checked) => {
        setIncludeD(checked);
        const newScale = getStandardScale(usePlusMinus, checked);
        setLocalScale(newScale);
    };

    // Updates the minimum percentage and re-sorts the list so higher numbers are on top
    const handleMinChange = (index, newMin) => {
        const updated = [...localScale];
        updated[index].min = parseInt(newMin) || 0;
        updated.sort((a, b) => b.min - a.min);
        setLocalScale(updated);
    };

    const handlePointsChange = (index, newPoints) => {
        const updated = [...localScale];
        updated[index].points = parseFloat(newPoints) || 0;
        setLocalScale(updated);
    };

    const handleLetterChange = (index, newLetter) => {
        const updated = [...localScale];
        updated[index].letter = newLetter;
        setLocalScale(updated);
    };

    // Adds a new custom grade level. Defaults to halfway between F and the lowest grade.
    const handleAddGrade = () => {
        const newMin = localScale.length > 0 ? Math.floor(localScale[localScale.length - 1].min / 2) : 50;
        const newScale = [...localScale, { min: newMin, points: 2.0, letter: "NEW" }];
        newScale.sort((a, b) => b.min - a.min);
        setLocalScale(newScale);
    };

    // Prevents deleting F because every scale needs an F
    const handleRemoveGrade = (index) => {
        const gradeToRemove = localScale[index];
        if (gradeToRemove.letter === 'F') return;
        const updated = localScale.filter((_, i) => i !== index);
        setLocalScale(updated);
    };

    const handleSave = () => {
        onSave(localScale);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="scale-modal-overlay" onClick={onClose}>
            <div className="scale-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="scale-modal-header">
                    <h2>Grade Scale Settings - {semesterName || 'Semester'}</h2>
                    <button onClick={onClose} className="scale-close-btn">&times;</button>
                </div>
                <div className="scale-modal-body">
                    <div className="scale-options">
                        <label className="scale-checkbox">
                            <input
                                type="checkbox"
                                checked={usePlusMinus}
                                onChange={(e) => handleUsePlusMinusChange(e.target.checked)}
                            />
                            Include +/- grading (A+, A, A-, B+, etc.)
                        </label>
                        <label className="scale-checkbox">
                            <input
                                type="checkbox"
                                checked={includeD}
                                onChange={(e) => handleIncludeDChange(e.target.checked)}
                            />
                            Include D grades
                        </label>
                    </div>

                    <div className="scale-table-container">
                        <table className="scale-table">
                            <thead>
                                <tr>
                                    <th>Letter Grade</th>
                                    <th>Minimum Percentage</th>
                                    <th>Grade Points</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {localScale.map((grade, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <input
                                                type="text"
                                                value={grade.letter}
                                                onChange={(e) => handleLetterChange(idx, e.target.value)}
                                                className="scale-letter-input"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={grade.min}
                                                onChange={(e) => handleMinChange(idx, e.target.value)}
                                                className="scale-min-input"
                                                min="0"
                                                max="100"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={grade.points}
                                                onChange={(e) => handlePointsChange(idx, e.target.value)}
                                                className="scale-points-input"
                                                step="0.1"
                                                min="0"
                                                max="4.0"
                                            />
                                        </td>
                                        <td>
                                            {grade.letter !== 'F' && (
                                                <button
                                                    onClick={() => handleRemoveGrade(idx)}
                                                    className="scale-remove-btn"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <button onClick={handleAddGrade} className="scale-add-btn">
                        + Add Grade Level
                    </button>

                    <div className="scale-modal-buttons">
                        <button onClick={onClose} className="btn-secondary">Cancel</button>
                        <button onClick={handleSave} className="btn-primary">Save Scale</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

