/* 

Group Two
Dr. Porter
CSCI 3300 

FolderManager.jsx 

Mason & 
Edits by Mackenzie for updated UI/UX & any connections

*/

/* components/folders/FolderManager.jsx - Semester cards display and management */

import { useState } from 'react';
import { calculateSemesterGPA } from '../../logic/gpaCalculator';

export default function FolderManager({
    folders = [],
    courses = [],
    assignments = [],
    gradeScale,
    institutions = [],
    onOpenSemester,
    onEditFolder,
    onDeleteFolder
}) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingFolder, setEditingFolder] = useState(null);

    // Opens the edit modal and stores which semester we're editing
    const handleOpenEdit = (folder, e) => {
        e.stopPropagation(); // Stops the card from also triggering the "open semester" action
        setEditingFolder({ ...folder });
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        if (editingFolder) {
            onEditFolder(editingFolder.id, {
                name: editingFolder.name,
                institutionID: editingFolder.institutionID,
            });
            setShowEditModal(false);
            setEditingFolder(null);
        }
    };

    // Deletes the semester, but asks for confirmation first because this also deletes all courses inside
    const handleDelete = () => {
        if (editingFolder && window.confirm(`Are you sure you want to delete "${editingFolder.name}" and all its courses?`)) {
            onDeleteFolder(editingFolder.id);
            setShowEditModal(false);
            setEditingFolder(null);
        }
    };

    if (folders.length === 0) {
        return <p className="empty-message">No semesters yet. Click "+ Add Semester" to begin.</p>;
    }

    return (
        <>
            <div className="grid">
                {folders.map(folder => {

                    // Filters courses to just the ones in this semester
                    const semesterCourses = courses.filter(c => c.folderID === folder.id);
                    const semesterGPA = calculateSemesterGPA(semesterCourses, assignments, gradeScale);
                    // Only show the first 3 course names, otherwise the card gets too crowded
                    const courseNames = semesterCourses.map(c => c.name).slice(0, 3);
                    const remainingCount = semesterCourses.length - 3;
                    
                    return (
                        <div 
                            key={folder.id} 
                            className="card"
                            onClick={() => onOpenSemester(folder.id)}
                            style={{ position: 'relative' }}
                        >
                            <div style={{ paddingRight: '30px' }}>
                               <div style={{ 
                                    display:        'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems:     'center', 
                                    marginBottom:   '8px',
                                    gap:            '8px',        
                                }}>
                            <div className="card-title" style={{ 
                                fontSize:   '16px', 
                                fontWeight: '500',
                                flex:       1,              
                            }}>
                            {folder.name}
                        </div>
                            {semesterGPA && (
                                 <div style={{ 
                                    backgroundColor: '#6366f1', 
                                    color:           'white', 
                                    padding:         '4px 10px',   
                                    borderRadius:    '12px',
                                    fontSize:        '12px',
                                    fontWeight:      '600',
                                    whiteSpace:      'nowrap',     
                                    flexShrink:      0,            
                                }}>
                                GPA: {semesterGPA}
                            </div>
                            )}
                        </div>
                                <div style={{ marginBottom: '8px' }}>
                                    {semesterCourses.length === 0 ? (
                                        <span className="card-subtitle">No courses yet</span>
                                    ) : (
                                        <div className="card-subtitle">
                                            {courseNames.map((name, idx) => (
                                                <span key={idx}>
                                                    {name}{idx < courseNames.length - 1 ? ', ' : ''}
                                                </span>
                                            ))}
                                            {remainingCount > 0 && ` +${remainingCount} more`}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Institution name (only shows if semester is assigned to one) */}
                                {folder.institutionID && (() => {
                                const inst = institutions.find(i => i.id === folder.institutionID);
                                return inst ? (
                                    <div className="card-subtitle" style={{ fontSize: '11px', color: '#666', fontStyle: 'italic', marginBottom: '4px' }}>
                                        {inst.name}
                                    </div>
                                 ) : null;
                                })()}
                                
                                <span className="card-subtitle" style={{ fontSize: '11px', color: '#999' }}>
                                    Click to open →
                                </span>
                            </div>
                            
                            <button
                                onClick={(e) => handleOpenEdit(folder, e)}
                                className="card-edit-btn"
                            >
                                ⋮
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Edit Semester Modal */}
            {showEditModal && editingFolder && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit Semester</h3>
                            <button onClick={() => setShowEditModal(false)} className="close-button">✕</button>
                        </div>
                        <div className="modal-body">
                            <div style={{ padding: '20px 24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Semester Name</label>
                                <input
                                    type="text"
                                    value={editingFolder.name}
                                    onChange={(e) => setEditingFolder({ ...editingFolder, name: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px 14px',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '15px',
                                        marginTop: '6px',
                                        boxSizing: 'border-box',
                                        outline: 'none',
                                    }}
                                />
                            </div>
                            {institutions.length > 0 && (
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Institution (optional)</label>
                                    <select
                                        value={editingFolder.institutionID || ''}
                                        onChange={(e) => setEditingFolder({ ...editingFolder, institutionID: e.target.value || null })}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <option value="">— Unassigned —</option>
                                        {institutions.map(inst => (
                                            <option key={inst.id} value={inst.id}>{inst.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>  
                        <div className="modal-buttons" style={{ justifyContent: 'flex-start' }}>
                             <button onClick={handleDelete} className="delete-button" style={{ marginRight: 'auto' }}>Delete Semester</button>
                             <button onClick={() => setShowEditModal(false)} className="btn-secondary">Cancel</button>
                            <button onClick={handleSaveEdit} className="btn-primary">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

