const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Student = require('../models/student');

var options=multer.diskStorage({
    destination:function(req,file,cb){
      if (file.mimetype !== 'image/jpeg') 
        { 
          return cb('Invalid file format');
        }
        cb(null, './uploads');
    },
    filename:function(req,file,cb){
      console.log(file)
      cb(null, (Math.random().toString(30)).slice(5, 10) + Date.now() + path.extname(file.originalname));
    }
  });

var upload= multer({ storage: options });

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/RegisterStud', (req, res) => {
    res.render('Register');
});

router.post('/addStudent', upload.single('Image'), (req, res) => {
    console.log(req.body);
    console.log(req.file);

    const imageFilename = path.basename(req.file.path);

    const newStud = new Student({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Email: req.body.Email,
        Contact: req.body.Contact,
        Gender: req.body.Gender,
        Course: req.body.Course,
        Password: req.body.Password,
        Image: imageFilename
    });

    newStud.save()
        .then(() => {
            console.log(newStud);
            res.redirect('/');
        })
        .catch((err) => {
            console.error(err);
        });
});

router.get('/students', (req, res) => {
    Student.find()
        .then((students) => {
            res.render('students', { students });
        })
        .catch((err) => {
            console.error(err);
        });
});

router.get('/files/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(err);
            return res.status(404).send('File not found');
        }

        // Send the file for download
        res.download(filePath, filename, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error downloading file');
            }
        });
    });
});

module.exports = router;