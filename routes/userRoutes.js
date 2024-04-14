const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../database/db');

const router = express.Router();

// Register a new student
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new student into the database
        const insertStudentQuery = 'INSERT INTO students(name, email, password) VALUES (?, ?, ?)';
        await db.promise().execute(insertStudentQuery, [name, email, hashedPassword]);

        res.status(201).json({ message: 'Student Registered Successfully' });
    } catch (err) {
        console.error('Error registering student:', err);
        res.status(500).json({ error: 'Student Registration Endpoint Error!' });
    }
});

// Get all students
router.get('/all', async(req, res) =>{
    try {
        const getAllStudentsQuery = 'SELECT * FROM students';
        const [rows] = await db.promise().execute(getAllStudentsQuery);

        res.status(200).json({ students: rows });
    } catch (error) {
        console.error('Error getting students:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update student by ID
router.put('/:student_id', async (req, res) =>{
    try {
        const studentId = req.params.student_id;
        const { name, email, password } = req.body;

        // Fetch the student from the database
        const getStudentQuery = 'SELECT * FROM students WHERE student_id = ?';
        const [studentRows] = await db.promise().execute(getStudentQuery, [studentId]);

        if (studentRows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the student's details in the database
        const updateStudentQuery = 'UPDATE students SET name = ?, email = ?, password = ? WHERE student_id = ?';
        await db.promise().execute(updateStudentQuery, [name, email, hashedPassword, studentId]);

        res.status(200).json({ message: 'Student updated successfully' });
    } catch(error) {
        console.error('Error updating student:', error);
        res.status(500).json({ error: 'Student Update Endpoint Error!' });
    }
});

module.exports = router;
