const express = require('express');
const router = express.Router();
const User = require('../models/student');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateSession = (req, res, next) => {
    const token = req.cookies.token; // Get the token from the cookies

    if (!token) return res.redirect('/login'); // If no token, return Unauthorized
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).send('Access Denied: Invalid Token!'); // If token is invalid, return Forbidden
        req.user = decoded; // Attach decoded user information to request
        
        next(); // Continue to the next middleware or route handler
    });
};

router.get('/', authenticateSession,(req, res) => {
    User.find()
        .then((user) => {
            res.render('index', { user });
        })
        .catch((err) => {
            console.error(err);
        });
});

router.get('/studentData/:id', authenticateSession,(req, res) => {
    User.findById(req.params.id)
        .then((stud) => {
            if (stud) {
                res.render('studentData', { stud });
            }
        })
        .catch((err) => {
            console.error(err);
        });
});

router.get('/edit/:id',authenticateSession, (req, res) => {
    User.findById(req.params.id)
        .then((stud) => {
            if (stud) {
                res.render('edit', { stud });
            }
        })
        .catch((err) => {
            console.error(err);
        });
});

router.post('/update/:id', authenticateSession, (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        .then(() => {
            res.redirect('/');
        })
        .catch((err) => {
            console.error(err);
        });
});

router.post('/delete/:id', authenticateSession, (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => {
            res.redirect('/');
        })
        .catch((err) => {
            console.error(err);
        });
});


router.get('/registration', (req, res) => {
    res.render('registration');
});

router.post('/addstud',(req, res) => {
    const newUser = new User(req.body);
    console.log(newUser);
    newUser.save()
        .then(() => {
            res.redirect('/');
        })
        .catch((err) => {
            console.error(err);
        });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(400).send('Invalid credentials');
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        // Store the token in a cookie
        res.cookie('token', token, { httpOnly: true });

        console.log("Login successful");
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/logout', (req, res) => {
    console.log("Logout successful");
    res.clearCookie('token');
    res.redirect('/login');
});

module.exports = router;