const router = require('express').Router();
const Order = require('../models/Order');
//const verifyToken = require('../middlewares/verify-token');

router.get('/orders',  async (req, res) => {
    try {
        let products = await Order.find({ owner: req.decoded._id }).deepPopulate('owner products.productID.owner').exec() //this is where the deep populate plugin is happening instead of writing 'owner product.productID, owner'
        
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

module.exports = router;