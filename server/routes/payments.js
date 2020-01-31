const router = require('express').Router();
//const moment = require('moment');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
//const verifyToken = require('../middlewares/verify-token');
const Order = require('../models/Order');

router.post('/payment',  (req, res) => {
    let totalPrice = Math.round(req.body.totalPrice * 100); // we get this from total price which is sent from the front end

    stripe.customers // create the customer by passing the email of that user
        .create({
            email: req.decoded.email
        })
        .then(customer => { // once the customer is created, then we create a source of the customer, the source is the information of the users card information, which we get from the front end
            return stripe.customers.createSource(customer.id, {
                source: 'tok_visa' // token visa -- testing token --> will change when in production
            });
        })
        .then(source => { // after we have created a source, we then want to charge the user, only if the card is valid
            return stripe.charges.create({
                amount: totalPrice, // passing in the amount which is the total price of the cart
                currency: 'usd',
                customer: source.customer // passing in the source object (the users card)
            })
        })
        .then(async charge => { // once we have charged the card, we want to pass in any custom logic. We want to create a new order object and then get the cart data from the front end
            let order = new Order(); // create new order object
            let cart = req.body.cart; // get the cart object from the front end

            cart.map(product => { // loop over all the products in the cart and push it to the order
                order.product.push({
                    productID: product._id,
                    quantity: parseInt(product.quantity),
                    price: product.price
                })
            })

            order.owner = req.decoded._id; // then we set our owner to the users ID from the verified token
            order.estimatedDelivery = req.body.estimatedDelivery; // then set the estimated delivery which set from the order in the request body 

            await order.save(); // then we save the order

            res.status(200).json({
                success: true,
                message: 'You have successfully made a payment!'
            })

        })
        .catch (err => {
            res.status(500).json({
                success: false,
                message: err.message
            })
        })
})

module.exports = router;