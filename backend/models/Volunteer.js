const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    avatar: { type: String, default: '🧑‍🚒' },
    rating: { type: Number, default: 5.0 },
    totalRescues: { type: Number, default: 0 },
    badge: {
        type: String,
        enum: ['New Rescuer', 'Bronze Rescuer', 'Silver Rescuer', 'Gold Rescuer', 'Platinum Rescuer'],
        default: 'New Rescuer',
    },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Volunteer', volunteerSchema);
