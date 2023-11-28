const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    event: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String, 
        required: true
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: [Number],
        required: true
    },
    seat: {
        type: [String], 
        required: false 
    },
    image: {
        type: String,
        required: false
    }
});

const events = mongoose.model('events', eventSchema);
module.exports = events;
