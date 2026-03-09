const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    date: { type: String, required: true },
    author: { type: String, required: true },
    content: { type: String, required: true },
}, { _id: false });

const milestoneSchema = new mongoose.Schema({
    date: { type: String, required: true },
    label: { type: String, required: true },
    completed: { type: Boolean, default: false },
}, { _id: false });

const animalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String, required: true },          // 'dog', 'cat', etc.
    emoji: { type: String, default: '🐾' },            // display emoji
    status: {
        type: String,
        enum: ['critical', 'stable', 'recovering', 'released', 'adopted'],
        default: 'stable',
    },
    rescuedBy: { type: String, default: '' },
    rescueDate: { type: String, default: '' },
    vet: { type: String, default: '' },
    location: { type: String, default: '' },
    photoUrl: { type: String, default: null },
    notes: { type: [noteSchema], default: [] },
    milestones: { type: [milestoneSchema], default: [] },
    description: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Animal', animalSchema);
