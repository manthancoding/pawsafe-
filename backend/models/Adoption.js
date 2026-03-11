const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema(
    {
        animal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Animal',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        applicantName: {
            type: String,
            required: [true, 'Applicant name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        notes: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Adoption', adoptionSchema);
