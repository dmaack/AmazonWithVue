const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [
        {
            productID: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number,
            price: Number
        }
    ],
    estimatedDelivery: String
});

OrderSchema.plugin(deepPopulate); // now allows us to deep populate more than one level

module.exports = mongoose.model('Order', OrderSchema);