const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    title: {
        type: String
    },
    image: {
        type: String
    },
    regular_price:{
        type: String
    },
    sale_price: {
        type: String
    },
    short_desc: {
        type: String
    },
    links: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }

},{versionKey: false})

module.exports = mongoose.model('product', dataSchema)