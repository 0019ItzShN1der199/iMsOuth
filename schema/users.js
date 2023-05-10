const { Schema, model } = require('mongoose')

const schema = new Schema({
    userId: String,
    access_token: String,
    refresh_token: String
})

module.exports = model('users', schema)