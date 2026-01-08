const Donation = require('../models/Donation');
const Razorpay = require('razorpay');
const crypto = require('crypto'); 

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Initiate a donation (Create Order)
// @route   POST /api/donations/initiate
exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        // req.user is added by the 'protect' middleware
        const userId = req.user.id; 

        // 1. Create DB Record (Pending)
        const newDonation = await Donation.create({
            userId: userId,
            amount: amount,
            status: 'pending' 
        });

        // 2. Create Razorpay Order
        const options = {
            amount: amount * 100, // Amount in paise
            currency: "INR",
            receipt: newDonation._id.toString(),
        };

        const order = await razorpay.orders.create(options);

        // 3. Send back details to Frontend
        res.status(200).json({
            success: true,
            order_id: order.id,       
            donation_id: newDonation._id, 
            key_id: process.env.RAZORPAY_KEY_ID 
        });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Verify Payment Signature
// @route   POST /api/donations/verify
exports.verifyPayment = async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature, 
            donation_id 
        } = req.body;

        // 1. Create the expected signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // 2. Success: Update DB
            await Donation.findByIdAndUpdate(donation_id, {
                status: 'success',
                paymentGatewayTransactionId: razorpay_payment_id
            });
            res.status(200).json({ success: true, message: "Payment Verified" });
        } else {
            // 3. Failure: Update DB
            await Donation.findByIdAndUpdate(donation_id, {
                status: 'failed'
            });
            res.status(400).json({ success: false, message: "Invalid Signature" });
        }

    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Get My Donations
// @route   GET /api/donations/my-history
exports.getMyDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching history" });
    }
};