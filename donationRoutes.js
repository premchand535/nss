const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getMyDonations } = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');

// All these routes need the user to be logged in ('protect')
router.post('/initiate', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/my-history', protect, getMyDonations);

module.exports = router;