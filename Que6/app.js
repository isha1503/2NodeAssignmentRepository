const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/ProductsDetails'); 

app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('view engine', 'ejs');

app.use('/', categoryRoutes);
app.use('/products', productRoutes);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

