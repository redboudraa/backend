const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Dash = new Schema({
    medid: {
        type: Number 
    },
    hour: {
        type: Number 
    },
    day: {
        type: Number 
    },
    month: {
        type: Number 
    },
    year: {
        type: Number 
    },

    
});

module.exports = mongoose.model('Dash', Dash);