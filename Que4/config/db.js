const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/ICT3_60Student');

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('Connected to MongoDB');
    });
};

module.exports = connectDB;