const express = require('express');
const router = express.Router();
const User = require('../models/users');

const authenticateSession = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

router.get('/', authenticateSession,(req, res) => {
    res.render('Home');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(400).send('Invalid credentials');
        }

        req.session.user = {
            id: user._id,
            username: user.username
        };

        console.log("Login successful");
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        console.log("logout successful");
        res.redirect('/login');
        
    });
});

module.exports = router;