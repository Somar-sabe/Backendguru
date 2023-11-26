//authModel.js
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: {
        type: String,
        default: null // This field will store the reset token, initially set as null
    }
    // You can add more fields as needed
});

module.exports = mongoose.model('authModel', userSchema);
