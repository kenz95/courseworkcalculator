/* 

Group Two
Dr. Porter
CSCI 3300 

CouseList.jsx 

Mason 
Edit by Mackenzie for updated UI/UX & any connections

*/


/* components/courses/CourseList.jsx - Course cards display and management */

import { useState } from 'react';
import { calculateCourseGrade } from '../../logic/gradeCalculator';

export default function CourseList({ 
    courses = [],
    assignments = [],
    onOpenCourse,
    onEditCourse,
    onDeleteCourse
}) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

    const handleOpenEdit = (course, e) => {
        e.stopPropagation(); // Stops the card click from also opening the course
        setEditingCourse({ ...course });
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        if (editingCourse) {
            onEditCourse(editingCourse.id, {
                name: editingCourse.name,
                creditHours: editingCourse.creditHours
            });
            setShowEditModal(false);
            setEditingCourse(null);
        }
    };

    const handleDelete = () => {
        if (editingCourse && window.confirm(`Are you sure you want to delete "${editingCourse.name}" and all its assignments?`)) {
            onDeleteCourse(editingCourse.id);
            setShowEditModal(false);
            setEditingCourse(null);
        }
    };

    if (courses.length === 0) {
        return <p className="empty-message">No courses yet. Click "+ Add Course" to begin.</p>;
    }

    return (
        <>
            <div className="grid">
                {courses.map(course => {
                    // Filters assignments to just the ones belonging to this course
                    const courseGrade = calculateCourseGrade(assignments.filter(a => a.courseID === course.id));
                    
                    return (
                        <div 
                            key={course.id} 
                            className="card"
                            style={{ backgroundColor: course.color + '20', borderColor: course.color, position: 'relative' }}
                        >
                            <div 
                                onClick={() => onOpenCourse(course.id)} 
                                style={{ cursor: 'pointer', paddingRight: '30px' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <div className="card-title" style={{ fontSize: '16px', fontWeight: '500' }}>{course.name}</div>
                                    {courseGrade && (
                                        <div style={{ 
                                            backgroundColor: course.color, 
                                            color: 'white', 
                                            padding: '2px 8px', 
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            {courseGrade}%
                                        </div>
                                    )}
                                </div>
                                <span className="card-subtitle">{course.creditHours} credits • Click to open →</span>
                            </div>
                            
                            <button
                                onClick={(e) => handleOpenEdit(course, e)}
                                className="card-edit-btn"
                            >
                                ⋮
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Edit Course Modal */}
            {showEditModal && editingCourse && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                   <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit Course</h3>
                            <button onClick={() => setShowEditModal(false)} className="close-button">✕</button>
                        </div>
                        <div className="modal-body">
                            <div style={{ padding: '20px 24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Course Name</label>
                                <input
                                    type="text"
                                    value={editingCourse.name}
                                    onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px 14px',
                                        border: '1.5px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '15px',
                                        marginTop: '6px',
                                        boxSizing: 'border-box',
                                        outline: 'none',
                                    }}
                                />
                            </div>
                          <div style={{ padding: '0 24px 20px 24px' }}>
                             <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Credit Hours</label>
                             <input
                                type="number"
                                value={editingCourse.creditHours}
                                onChange={(e) => setEditingCourse({ ...editingCourse, creditHours: parseInt(e.target.value) || 0 })}
                                min="1"
                                max="6"
                                step="1"
                                style={{
                                     width: '100%',
                                    padding: '10px 14px',
                                    border: '1.5px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '15px',
                                    boxSizing: 'border-box',
                                    outline: 'none',
                                }}
                             />
                            </div>
                        </div>
                        <div className="modal-buttons" style={{ justifyContent: 'flex-start' }}>
                            <button onClick={handleDelete} className="delete-button" style={{ marginRight: 'auto' }}>Delete Course</button>
                            <button onClick={() => setShowEditModal(false)} className="btn-secondary">Cancel</button>
                            <button onClick={handleSaveEdit} className="btn-primary">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

