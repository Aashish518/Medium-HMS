const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    amount: { type: Number, required: true },
    payment_date: { type: Date, required: true },
    payment_mode: { type: String, enum: ['Cash', 'UPI', 'Card'], required: true },
    payment_status: { type: String, default:"Complet", required: true }
});

module.exports = mongoose.model('Fee', feeSchema);