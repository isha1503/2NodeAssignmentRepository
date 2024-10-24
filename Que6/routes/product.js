const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');
const multer = require('multer');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/products/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// List all products
router.get('/', async (req, res) => {
    const products = await Product.find({}).populate('category');
    res.render('products/index', { products });
});

// Create new product form
router.get('/create', async (req, res) => {
    const categories = await Category.find({});
    console.log(categories);
    res.render('products/create', { categories });
});

router.post('/:id', upload.array('images', 5), async (req, res) => {
    console.log('Received ID:', req.params.id);
    console.log('Request Files:', req.files);
    console.log('Request Body:', req.body);

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        console.error('Invalid ID format');
        return res.status(400).send('Invalid ID format');
    }

    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            console.error('Product not found');
            return res.status(404).send('Product not found');
        }

        product.name = req.body.name;
        product.description = req.body.description;
        product.category = req.body.category;
        product.price = req.body.price;

        if (req.files.length > 0) {
            product.images = req.files.map(file => file.filename);
        }

        await product.save();
        console.log('Product updated successfully');
        res.redirect('/products');
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Internal Server Error');
    }
});



// Edit product form
router.get('/:id/edit', async (req, res) => {
    const product = await Product.findById(req.params.id);
    const categories = await Category.find({});
    res.render('products/edit', { product, categories });
});

// Update product
router.post('/:id', upload.array('images', 5), async (req, res) => {
    const product = await Product.findById(req.params.id);
    product.name = req.body.name;
    product.description = req.body.description;
    product.category = req.body.category;
    product.price = req.body.price;
    
    if (req.files.length > 0) {
        product.images = req.files.map(file => file.filename);
    }
    
    await product.save();
    res.redirect('/products');
});

// Delete product
router.post('/:id/delete', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
});

module.exports = router;
