/* 

Group Two
Dr. Porter
CSCI 3300 

Mason & 
Edits by Mackenzie for imports & connecting all team member's code

*/

/* src/index.jsx - Entry point. Loads saved data from localStorage and sets up the app. */

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { v4 as uuidv4 } from 'uuid';
import { createInitialState, serializeState, deserializeState } from './data/localStorageManager.js';
import { createFolder, createCourse, createAssignment } from "./models/index.js";
import './App.css';

const STORAGE_KEY = 'coursework_calculator_v1';

function MainApp() {
    const [folders, setFolders] = useState([]);
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);

    // When the app first loads, grab whatever was saved in localStorage
    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        const state = deserializeState(raw);
        setFolders(state.folders || []);
        setCourses(state.courses || []);
        setAssignments(state.assignments || []);
    }, []);

    // Every time the data changes, save it back to localStorage
    useEffect(() => {
        const state = { 
            folders, 
            courses, 
            assignments, 
            institutions: [], 
            alerts: [], 
            settings: {} 
        };
        localStorage.setItem(STORAGE_KEY, serializeState(state));
    }, [folders, courses, assignments]);

    // Semester handlers
    const handleAddFolder = (newFolder) => {
        const folderWithId = createFolder({
            name: newFolder.name,
            institutionID: newFolder.institutionID || null
        });
        setFolders([...folders, folderWithId]);
    };

    const handleUpdateFolder = (id, updates) => {
        setFolders(folders.map(folder => 
            folder.id === id ? { ...folder, ...updates } : folder
        ));
    };

    const handleDeleteFolder = (id) => {
        setFolders(prev => prev.filter(f => f.id !== id));
        const coursesToDelete = courses.filter(c => c.folderID === id);
        setCourses(prev => prev.filter(c => c.folderID !== id));
        const courseIdsToDelete = coursesToDelete.map(c => c.id);
        setAssignments(prev => prev.filter(a => !courseIdsToDelete.includes(a.courseID)));
    };

    // Course handlers
    const handleAddCourse = (newCourse) => {
        const courseWithId = createCourse({
            name: newCourse.name,
            folderID: newCourse.folderID,
            creditHours: newCourse.creditHours,
            color: newCourse.color,
            institutionID: newCourse.institutionID || null
        });
        setCourses([...courses, courseWithId]);
    };

    const handleUpdateCourse = (id, updates) => {
        setCourses(courses.map(course => 
            course.id === id ? { ...course, ...updates } : course
        ));
    };

    const handleDeleteCourse = (id) => {
        setCourses(prev => prev.filter(c => c.id !== id));
        setAssignments(prev => prev.filter(a => a.courseID !== id));
    };

    // Assignment handlers
    const handleAddAssignment = (newAssignment) => {
        const assignmentWithId = createAssignment({
            name: newAssignment.name,
            courseID: newAssignment.courseID,
            category: newAssignment.category || '',
            weight: newAssignment.weight || 0,
            points: newAssignment.points || null,
            grade: newAssignment.grade || null,
            dueDate: newAssignment.dueDate || null,
            notes: newAssignment.notes || '',
            isDropped: false
        });
        setAssignments([...assignments, assignmentWithId]);
    };

    const handleUpdateAssignment = (id, updates) => {
        setAssignments(assignments.map(assignment => 
            assignment.id === id ? { ...assignment, ...updates } : assignment
        ));
    };

    const handleDeleteAssignment = (id) => {
        setAssignments(prev => prev.filter(a => a.id !== id));
    };

    return (
        <App
            folders={folders}
            courses={courses}
            assignments={assignments}
            onAddFolder={handleAddFolder}
            onUpdateFolder={handleUpdateFolder}
            onDeleteFolder={handleDeleteFolder}
            onAddCourse={handleAddCourse}
            onUpdateCourse={handleUpdateCourse}
            onDeleteCourse={handleDeleteCourse}
            onAddAssignment={handleAddAssignment}
            onUpdateAssignment={handleUpdateAssignment}
            onDeleteAssignment={handleDeleteAssignment}
        />
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <MainApp />
    </React.StrictMode>
);