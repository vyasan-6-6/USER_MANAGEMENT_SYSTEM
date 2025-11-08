const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    mobile: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    is_Admin: {
        type: Number,
        required: true,
    },
    is_verified: {
        type: Number,
        default: 0,
    },
    token: {
        type: String,
        default: "",
    },
});

module.exports = mongoose.model("User", modelSchema);
