const router = require('express').Router();
const Category = require('../models/Category');

// POST - create new category
router.post('/categories', async (req, res) => {
    try {
        const category = new Category();
        category.type = req.body.type;

        await category.save();

        res.status(201).json({
            success: true,
            message: 'You have successfully created a new category'
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});

// Get - Get Categories
router.get('/categories', async (req, res) => {
    try {
        let categories = await Category.find();

        res.status(200).json({
            success: true,
            categories: categories
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

module.exports = router;