const mongoose = require('mongoose');


const productScheme = mongoose.Schema({
    image: String,
    name: String,
    price: String,
    discount: {
        type: Array,
        default: 0
    },
    bgcolor: String,
    panelcolor: String,
    textcolor: String,
})

module.exports = mongoose.model("product", productScheme);