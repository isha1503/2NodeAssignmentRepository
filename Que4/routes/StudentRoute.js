const express = require('express');
const router = express.Router();
const User = require('../models/student');

const authenticateSession = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
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
        const user = await User.findOne({ username });
        console.log(user);
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