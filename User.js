const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate registrations
    lowercase: true
  },
  password: {
    type: String,
    required: true // Store the HASHED password here, not plain text
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Strictly restricts roles
    default: 'user'
  },
  phone: {
    type: String, 
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);