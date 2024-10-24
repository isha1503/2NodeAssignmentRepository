const express = require('express');
const app = express();
const port = 8080;
const dbcon = require('./config/db');
const studentroute = require('./routes/StudentRoute');

dbcon();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'));  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', studentroute);

app.listen(port,()=>{
    console.log(`server is listening at http://localhost:${port}`);
});