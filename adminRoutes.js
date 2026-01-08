const express = require('express');
const router = express.Router();
const { getAllUsers, getAllDonations, getAdminStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes here need BOTH 'protect' (logged in) AND 'admin' (role check)
router.get('/users', protect, admin, getAllUsers);
router.get('/donations', protect, admin, getAllDonations);
router.get('/stats', protect, admin, getAdminStats);

module.exports = router;