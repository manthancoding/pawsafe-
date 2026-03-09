const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    type: { type: String, default: 'Animal Rescue' },
    animals: { type: [String], default: ['Dog', 'Cat'] },  // animal types handled
    verified: { type: Boolean, default: true },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
}, { timestamps: true });

module.exports = mongoose.model('NGO', ngoSchema);
