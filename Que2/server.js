const express = require('express');
const app = express();
const port = 8080;
const connectDB = require('./config/db');
const userRoutes = require('./routes/UserRoute');
const session = require('express-session');

connectDB();

app.use(session({
    secret: 'akshita',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', userRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});