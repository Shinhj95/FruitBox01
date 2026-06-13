const mongoose = require("mongoose");

const fruitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    image: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: "",
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Fruit", fruitSchema);