const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema for storing Thapar users (students and teachers)
const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: true,
    },
    // Email address (must be unique)
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    // Hashed password
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    // Profile photo URL (optional, default avatar)
    photoURL: {
      type: String,
      default: null,
    },
    // Average rating based on reviews received
    averageRating: {
      type: Number,
      default: 0,
    },
    // Number of items sold
    itemsSold: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
