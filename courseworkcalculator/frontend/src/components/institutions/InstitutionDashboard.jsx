/* 

Group Two
Dr. Porter
CSCI 3300 

InstitutionDashboard.jsx

Angie & 
Edits by Mackenzie for updated UI/UX & any connections

*/

/* components/institutions/InstitutionDashboard.jsx - Grouped institution view with cumulative GPAs */

import { useState } from 'react';
import { calculateCumulativeGPA } from '../../logic/gpaCalculator';

export default function InstitutionDashboard({
    institutions = [],
    folders = [],
    courses = [],
    assignments = [],
    gradeScale,
    onAddInstitution,
    onUpdateInstitution,
    onDeleteInstitution,
    onOpenSemester,

}) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingInstitution, setEditingInstitution] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [newName, setNewName] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    // Create 
    const handleCreate = () => {
        const trimmed = newName.trim();
        if (!trimmed) return;
        onAddInstitution(trimmed);
        setNewName('');
        setShowCreateModal(false);
    };

    // Toggle Menu 
    const handleToggleMenu = (instId, e) => {
        e.stopPropagation();
        setOpenMenuId(prev => prev === instId ? null : instId);
    };

    // Edit Menu 
    const handleOpenEdit = (inst, e) => {
        e.stopPropagation();
        setEditingInstitution({ ...inst });
        setShowEditModal(true);
        setOpenMenuId(null);
    };

    // Save Edit Changes 

    const handleSaveEdit = () => {
        if (editingInstitution && editingInstitution.name.trim()) {
            onUpdateInstitution(editingInstitution.id, {
                name: editingInstitution.name.trim()
            });
            setShowEditModal(false);
            setEditingInstitution(null);
        }
    };

    // Delete 
    const handleDelete = (inst) => {
        if (window.confirm(`Delete "${inst.name}"? Its semesters will become unassigned.`)) {
            onDeleteInstitution(inst.id);
        }
    };

    const unassignedFolders = folders.filter(f => !f.institutionID);

    return (
       <div className="container">
            <div className="section">
                <div className="section-header">
                    <h2 className="section-title">Institutions</h2>
                    <button onClick={() => setShowCreateModal(true)} className="add-button">+ Add Institution</button>
                </div>

                {institutions.length === 0 && unassignedFolders.length === 0 && (
                    <p className="empty-message">No institutions yet. Click "+ Add Institution" to begin.</p>
            )}

            {/* Institution cards */}
            {institutions.length > 0 && (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                    {institutions.map(inst => {
                        const instFolders = folders.filter(f => f.institutionID === inst.id);
                        const cumulativeGPA = calculateCumulativeGPA(instFolders, courses, assignments, gradeScale);
                        const semesterCount = instFolders.length;

                        return (
                            <div key={inst.id} className="card" style={{ position: 'relative' }}>
                                <div 
                                    style={{ paddingRight: '30px' }}
                                    onClick={() => setExpandedId(expandedId === inst.id ? null : inst.id)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <div className="card-title" style={{ fontSize: '16px', fontWeight: '500' }}>{inst.name}</div>
                                        {cumulativeGPA && (
                                           <div style={{
                                                backgroundColor: '#6366f1',
                                                color: 'white',
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                whiteSpace: 'nowrap',
                                                flexShrink: 0,
                                            }}>
                                                GPA: {cumulativeGPA}
                                            </div>
                                        )}
                                    </div>
                                    <span className="card-subtitle">
                                        {semesterCount === 0
                                            ? 'No semesters assigned'
                                            : `${semesterCount} semester${semesterCount !== 1 ? 's' : ''}`}
                                    </span>

                                     {semesterCount > 0 && expandedId !== inst.id && (
                                        <span className="card-subtitle" style={{ fontSize: '11px', color: '#999', display: 'block', marginTop: '4px' }}>
                                            {expandedId === inst.id ? 'Click to collapse ↑' : 'Click to expand ↓'}
                                        </span>
                                    )}

                                </div>

                            {/* Expanded list of semesters */}
                                {expandedId === inst.id && instFolders.length > 0 && (
                                    <div style={{ 
                                        marginTop: '12px', 
                                        paddingTop: '12px', 
                                        borderTop: '1px solid #e0e0e0',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '6px',
                                    }}>

                                    {instFolders.map(folder => (
                                        <button
                                            key={folder.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (onOpenSemester) onOpenSemester(folder.id);
                                            }}

                                         style={{
                                                background: '#f9f9f9',
                                                border: '1px solid #e0e0e0',
                                                borderRadius: '6px',
                                                padding: '8px 12px',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                fontSize: '13px',
                                                color: '#333',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#f9f9f9'}
                                        >
                                        <span>{folder.name}</span>
                                        <span style={{ fontSize: '11px', color: '#999' }}>Open →</span>
                                    </button>
                                ))}
                            </div>
                        )}
                                <button
                                    onClick={(e) => handleToggleMenu(inst.id, e)}
                                    className="card-edit-btn"
                                >
                                    ⋮
                                </button>

                                {/* Edit/Delete dropdown menu */}
                                {openMenuId === inst.id && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '40px',
                                        right: '8px',
                                        background: 'white',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '6px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        zIndex: 100,
                                        minWidth: '120px',
                                    }}>
                                        <button
                                            onClick={(e) => handleOpenEdit(inst, e)}
                                            style={{
                                                display: 'block',
                                                width: '100%',
                                                padding: '8px 12px',
                                                background: 'none',
                                                border: 'none',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                color: '#333',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(inst, e)}
                                            style={{
                                                display: 'block',
                                                width: '100%',
                                                padding: '8px 12px',
                                                background: 'none',
                                                border: 'none',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                color: '#ef4444',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

            {/* Unassigned semesters */}
            {unassignedFolders.length > 0 && (
                <div className="section" style={{ marginTop: '24px' }}>
                    <h3 className="section-title" style={{ fontSize: '16px', marginBottom: '12px' }}>Unassigned Semesters</h3>
                    <div className="grid">
                        {unassignedFolders.map(folder => (
                            <div key={folder.id} className="card">
                                <div className="card-title" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>
                                    {folder.name}
                                </div>
                                <span className="card-subtitle">Not assigned to an institution</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Create Institution Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add Institution</h3>
                            <button onClick={() => setShowCreateModal(false)} className="close-button">✕</button>
                        </div>
                        <div className="modal-body">
                            <div style={{ padding: '20px 24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Institution Name</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                                    placeholder="e.g. State University or Community College"
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
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={() => setShowCreateModal(false)} className="btn-secondary">Cancel</button>
                            <button onClick={handleCreate} className="btn-primary">Add</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Institution Modal */}
            {showEditModal && editingInstitution && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit Institution</h3>
                            <button onClick={() => setShowEditModal(false)} className="close-button">✕</button>
                        </div>
                        <div className="modal-body">
                            <div style={{ padding: '20px 24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Institution Name</label>
                                <input
                                    type="text"
                                    value={editingInstitution.name}
                                    onChange={(e) => setEditingInstitution({ ...editingInstitution, name: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
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
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="modal-buttons" style={{ justifyContent: 'flex-start' }}>
                            <button 
                                onClick={() => {
                                    if (window.confirm(`Delete "${editingInstitution.name}"? Its semesters will become unassigned.`)) {
                                        onDeleteInstitution(editingInstitution.id);
                                        setShowEditModal(false);
                                        setEditingInstitution(null);
                                    }
                                }} 
                                className="delete-button"
                                style={{ marginRight: 'auto' }}
                            >
                                Delete Institution
                            </button>
                            <button onClick={() => setShowEditModal(false)} className="btn-secondary">Cancel</button>
                            <button onClick={handleSaveEdit} className="btn-primary">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}