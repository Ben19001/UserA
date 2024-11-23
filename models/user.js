const mongoose = require("mongoose");

const newUserSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true, minlength: 8, maxlength: 64 },
    resetPasswordExpire: { type: Date },
    resetPasswordToken: { type: String }
});

const User = mongoose.model('user', newUserSchema);
module.exports = User;
