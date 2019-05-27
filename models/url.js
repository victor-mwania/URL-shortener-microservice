const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const urls = new Schema({
    "originalUrl": String,
    "urlCode": String,
    "shortUrl": String
})

const Url = mongoose.model('Url', urls)

module.exports = Url