const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    Email: String,
    Contact: Number,
    Gender: String,
    Course: String,
    username: String,
    password: String
});

const Students = mongoose.model('Student', studentSchema, 'StudnetsData');

module.exports = Students;