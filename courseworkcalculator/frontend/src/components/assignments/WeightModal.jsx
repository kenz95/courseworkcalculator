/* 

Group Two
Dr. Porter
CSCI 3300 

WeightModal.jsx 

Mason
& Edits by Mackenzie to fix formatting & certain styles 

*/

/* components/assignments/WeightModal.jsx - Set assignment weights modal */

import { useState } from 'react';

export default function WeightModal({ 
    isOpen, 
    onClose,
    assignments = [],
    onUpdateAssignment,
    courseName
}) {
    // Updates the weight percentage for an assignment. Defaults to 0 if they type something invalid.
    const handleWeightChange = (assignmentId, value) => {
        const assignment = assignments.find(a => a.id === assignmentId);
        onUpdateAssignment(assignmentId, { ...assignment, weight: parseFloat(value) || 0 });
    };

    // Just adds up all the weights so the user can see if they hit 100%
    const calculateTotal = () => {
        const total = assignments.reduce((sum, a) => sum + (a.weight || 0), 0);
        return total;
    };

    const total = calculateTotal();

    if (!isOpen) return null;

    return (
        <div className="modal modal-weight" onClick={(e) => e.stopPropagation()}>
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Assignment Weights - {courseName}</h3>
                    <button onClick={onClose} className="close-button">✕</button>
                </div>

                <div className="modal-assignment-list">
                    {assignments.length === 0 ? (
                        <p className="empty-message">No assignments added for this course.</p>
                    ) : (
                        assignments.map(assignment => (
                            <div key={assignment.id} className="modal-assignment-item">
                                <span className="modal-assignment-name">{assignment.name}</span>
                                <input
                                    type="number"
                                    value={assignment.weight || 0}
                                    onChange={(e) => handleWeightChange(assignment.id, e.target.value)}
                                    className="weight-input"
                                    placeholder="%"
                                    step="any"
                                />
                                <span className="weight-unit">%</span>
                            </div>
                        ))
                    )}
                </div>

                <div className="total-line">
                    <span className="total-label">Total:</span>
                    <div className="total-value">
                        <span>{total}%</span>
                    </div>
                </div>
                <div className="modal-buttons" style={{ justifyContent: 'flex-end' }}>
                    <button onClick={onClose} className="btn-primary">Done</button>
                </div>
            </div>
        </div>
    </div>
    );
}

