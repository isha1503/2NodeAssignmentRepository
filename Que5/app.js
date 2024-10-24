const express = require('express');
const app = express();
const port = 8080;
const connectDB = require('./config/db');
const studRoutes = require('./routes/StudentRoute');
const cookieParser = require('cookie-parser');

connectDB();

app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', studRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});