const router = require('express').Router();
const Product = require('../models/Product');

const upload = require('../middlewares/upload-photo');

// POST - create new product
router.post('/products', upload.single('photo'), async(req, res) => {
    try {
        let product = new Product();
        product.title = req.body.title;
        product.description = req.body.description;
        product.photo = req.file.location;
        product.price = req.body.price;
        product.stockQuantity = req.body.stockQuantity;
        product.ownerID = req.body.ownerID;
        product.categoryID = req.body.categoryID;

        await product.save();

        res.status(201).json({
            success: true,
            message: 'Product was successfully added'
        })
    } catch (err) {
        res.status(500).json({
            succes: false,
            message: err.message
        })
    }
})
// GET - get all products
router.get('/products', async (req, res) => {
    try {
        let products = await Product.find();

        res.status(200).json({
            success: true,
            products: products
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
})
// GET - get a single product
router.get('/products/:id', async (req, res) => {
    try {
        let product = await Product.findOne({ _id: req.params.id });

        res.status(200).json({
            success: true,
            product: product
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

// PUT - update a single product
router.put('/products/:id', upload.single('photo'), async (req, res) => {
    try {
        let product = await Product.findOneAndUpdate({ _id: req.params.id }, {
            $set: {
                title: req.body.title,
                category: req.body.categoryID,
                description: req.body.description,
                photo: req.file.location,
                price: req.body.price,
                stockQuantity: req.body.stockQuantity,
                owner: req.body.ownerID
            }
        }, {upsert: true}); // if this product with the given ID doesnt exist, then create this object anyways

            

        res.status(200).json({
            success: true,
            updatedProduct: product
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

// DELETE - delete a single product
router.delete('/products/:id', async (req, res) => {
    try {
        let deletedProduct = await Product.findOneAndDelete({ _id: req.params.id});

        if(deletedProduct) {
            res.status(200).json({
                status: true,
                message: `You successfully deleted the product with the ID of ${req.params.id}`
            })
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

module.exports = router;