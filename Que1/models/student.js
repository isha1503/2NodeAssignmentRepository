const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    Image: String,
    FirstName: String,
    LastName: String,
    Email: String,
    Contact: Number,
    Gender: String,
    Course: String,
    Password: String
});

const Book = mongoose.model('Studnet', studentSchema, 'StudnetsData');

module.exports = Book;