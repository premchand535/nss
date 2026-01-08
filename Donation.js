const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links this donation to a specific User
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1 // prevent negative or zero donations
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentGatewayTransactionId: {
    type: String,
    default: null // Will be populated once the gateway responds
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'], // Vital for "Section 7" requirements
    default: 'pending'
  },
  message: {
    type: String, // Optional message from donor
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now // Timestamp for tracking
  }
});

module.exports = mongoose.model('Donation', donationSchema);