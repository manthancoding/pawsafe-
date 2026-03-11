const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [60, 'Name cannot exceed 60 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // never returned by default
        },
        role: {
            type: String,
            enum: ['user', 'volunteer', 'admin'],
            default: 'user',
        },
        phone: {
            type: String,
            default: '',
        },
        city: {
            type: String,
            default: '',
        },
        favorites: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Animal'
        }],
        avatar: {
            type: String,
            default: '',
        },
        otp: {
            type: String,
            select: false,
        },
        otpExpiry: {
            type: Date,
            select: false,
        },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password helper
userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
