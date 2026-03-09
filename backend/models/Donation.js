const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    cause: {
        type: String,
        enum: ['food', 'medical', 'shelter', 'general'],
        required: true,
    },
    amount: { type: Number, required: true, min: 1 },
    type: { type: String, enum: ['onetime', 'monthly'], required: true },
    plan: { type: String, default: null },      // basic | care | guardian (monthly only)
    donorName: { type: String, default: 'Anonymous' },
    donorEmail: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
