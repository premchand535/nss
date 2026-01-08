const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to parse JSON bodies

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const donationRoutes = require('./routes/donationRoutes'); // Ensure you created this file from previous step
const adminRoutes = require('./routes/adminRoutes'); //

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin', adminRoutes); //

// Base Route
app.get('/', (req, res) => {
  res.send('NGO Backend is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

