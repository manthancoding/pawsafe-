const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
    animalType: {
        type: String,
        required: true,
        enum: ['dog', 'cat', 'bird', 'rabbit', 'other'],
    },
    issueType: {
        type: String,
        required: true,
        enum: ['injured', 'trapped', 'lost', 'abandoned', 'other'],
    },
    location: { type: String, default: '' },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    details: { type: String, default: '' },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    photoUrl: { type: String, default: null },
    status: {
        type: String,
        enum: ['pending', 'active', 'accepted', 'resolved', 'declined'],
        default: 'pending',
    },
    urgency: {
        type: String,
        enum: ['critical', 'urgent', 'moderate'],
        default: 'urgent',
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Emergency', emergencySchema);
