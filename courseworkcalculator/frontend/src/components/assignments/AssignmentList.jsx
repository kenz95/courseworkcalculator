/* 

Group Two
Dr. Porter
CSCI 3300 

AssignmentList.jsx 

Mason

*/

/* components/assignments/AssignmentList.jsx - Assignment items with grade editing */
import Icon from '../../utils/Icon';
import { GradeConverter } from '../../logic/gradeConverter';

export default function AssignmentList({ 
    assignments = [],
    gradeScale,
    onUpdateAssignment,
    onDeleteAssignment,
    onAddAssignment,
    onOpenWeightModal
}) {

    const converter = new GradeConverter(gradeScale);
    
    // Updates the grade for a single assignment. Uses parseFloat so decimals work (like 89.5)
    const handleUpdateGrade = (assignmentId, grade) => {
        const assignment = assignments.find(a => a.id === assignmentId);
        onUpdateAssignment(assignmentId, { ...assignment, grade: parseFloat(grade) || null });
    };

    // Confirmation dialog before deleting. Don't want someone accidentally wiping out their homework.
    const handleDelete = (assignment) => {
        if (window.confirm(`Are you sure you want to delete "${assignment.name}"?`)) {
            onDeleteAssignment(assignment.id);
        }
    };

    return (
        <>
            {/* Header row with the title and action buttons */}
            <div className="section-header">
                <h2 className="section-title">Assignments</h2>
                <div className="button-group">
                    <button onClick={onOpenWeightModal} className="settings-button">
                        <Icon name="settings" size={14} color="white" /> Set Assignment Weights
                    </button>
                    <button onClick={onAddAssignment} className="add-button">
                        + Add Assignment
                    </button>
                </div>
            </div>

            {/* The actual list of assignments. Shows a message if nothing's here yet. */}
            <div className="assignment-list">
                {assignments.length === 0 ? (
                    <p className="empty-message">No assignments added for this course.</p>
                ) : (
                    assignments.map(assignment => (
                        <div key={assignment.id} className="assignment-item">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                <input
                                    type="text"
                                    value={assignment.name}
                                    onChange={(e) => onUpdateAssignment(assignment.id, { ...assignment, name: e.target.value })}
                                    className="assignment-name-input"
                                    style={{ flex: 2 }}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '14px', color: '#666' }}>Grade:</span>
                                    <input
                                        type="number"
                                        value={assignment.grade ?? ''}
                                        onChange={(e) => handleUpdateGrade(assignment.id, e.target.value)}
                                        className="grade-input"
                                        min="0"
                                        max="100"
                                        step="1"
                                        style={{ width: '80px' }}
                                    />
                                    <span style={{ fontSize: '14px' }}>%</span>
                                        {assignment.grade !== null && assignment.grade !== '' && (
                                            <span style={{ 
                                                fontSize: '14px', 
                                                fontWeight: '600', 
                                                color: '#6366f1', 
                                                marginLeft: '4px' 
                                            }}>
                                                ({converter.percentageToLetter(assignment.grade)})
                                            </span>
                                        )}
                                </div>
                                <button
                                    onClick={() => handleDelete(assignment)}
                                    className="delete-assignment-btn"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}
