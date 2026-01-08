const User = require('../models/User');
const Donation = require('../models/Donation');

// @desc    Get all users (with optional name/email filter)
// @route   GET /api/admin/users?search=john
exports.getAllUsers = async (req, res) => {
    try {
        // Check if there is a search query ?search=...
        const keyword = req.query.search ? {
            $or: [
                { name: { $regex: req.query.search, $options: 'i' } }, // Case-insensitive name
                { email: { $regex: req.query.search, $options: 'i' } } // Case-insensitive email
            ]
        } : {};
        const users = await User.find(keyword).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get all donations (Admin only)
// @route   GET /api/admin/donations
exports.getAllDonations = async (req, res) => {
    try {
        // Populate user details so admin knows WHO donated
        const donations = await Donation.find({})
            .populate('userId', 'name email') 
            .sort({ createdAt: -1 });
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get Dashboard Stats (Total Amount, Total Count)
// @route   GET /api/admin/stats
exports.getAdminStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        
        // Aggregate total successful donations
        const donationStats = await Donation.aggregate([
            { $match: { status: 'success' } },
            { $group: { _id: null, totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } }
        ]);

        const totalAmount = donationStats.length > 0 ? donationStats[0].totalAmount : 0;
        const totalDonations = donationStats.length > 0 ? donationStats[0].count : 0;

        res.status(200).json({
            userCount,
            totalAmount,
            totalDonations
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};