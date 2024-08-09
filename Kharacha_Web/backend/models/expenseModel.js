const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    comments: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
