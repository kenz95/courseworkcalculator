/* 

Group Two
Dr. Porter
CSCI 3300 

InstitutionDashboard.jsx

Angie

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
    onDeleteInstitution,
}) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newName, setNewName] = useState('');

    const handleCreate = () => {
        const trimmed = newName.trim();
        if (!trimmed) return;
        onAddInstitution(trimmed);
        setNewName('');
        setShowCreateModal(false);
    };

    const handleDelete = (inst) => {
        if (window.confirm(`Delete "${inst.name}"? Its semesters will become unassigned.`)) {
            onDeleteInstitution(inst.id);
        }
    };

    const unassignedFolders = folders.filter(f => !f.institutionID);

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="section-title">Institutions</h2>
                <button onClick={() => setShowCreateModal(true)} className="add-button">+ Add Institution</button>
            </div>

            {institutions.length === 0 && unassignedFolders.length === 0 && (
                <p className="empty-message">No institutions yet. Click "+ Add Institution" to begin.</p>
            )}

            {/* Institution cards */}
            {institutions.length > 0 && (
                <div className="grid">
                    {institutions.map(inst => {
                        const instFolders = folders.filter(f => f.institutionID === inst.id);
                        const cumulativeGPA = calculateCumulativeGPA(instFolders, courses, assignments, gradeScale);
                        const semesterCount = instFolders.length;

                        return (
                            <div key={inst.id} className="card" style={{ position: 'relative' }}>
                                <div style={{ paddingRight: '30px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <div className="card-title" style={{ fontSize: '16px', fontWeight: '500' }}>{inst.name}</div>
                                        {cumulativeGPA && (
                                            <div style={{
                                                backgroundColor: '#6366f1',
                                                color: 'white',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: '600'
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
                                </div>

                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(inst); }}
                                    className="card-edit-btn"
                                >
                                    ⋮
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

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
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h3>Add Institution</h3>
                            <button onClick={() => setShowCreateModal(false)} className="close-button">✕</button>
                        </div>
                        <div className="modal-body">
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Institution Name</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                                    placeholder="e.g. University of North Georgia"
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                    }}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="modal-buttons" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button onClick={() => setShowCreateModal(false)} className="btn-secondary">Cancel</button>
                            <button onClick={handleCreate} className="btn-primary">Add</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

