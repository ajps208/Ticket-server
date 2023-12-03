const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    eventId: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    qty: {
        type: String,
        required: false
    },
    orderPrice: {
        type: String,
        required: true
    },
   
    orderDate: {
        type: String,
        required: true
    },
  
   
});

const orders = mongoose.model('orders', orderSchema);
module.exports = orders;
