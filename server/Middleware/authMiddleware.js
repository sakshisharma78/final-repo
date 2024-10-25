const jwt = require('jsonwebtoken');
const User = require('../Models/user'); // Adjust the path to your User model
require('dotenv').config(); // Load environment variables

const protect = async (req, res, next) => {
    let token;

    console.log("Middleware triggered");
    console.log("Headers:", req.headers); // Log all headers

    // Try to fetch the token from headers
    token = req.headers['auth-token']; // Ensure your client sends the token in this header

    if (!token) {
        console.log("Token not found in headers");
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        // Verify token using JWT_SECRET from the environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        console.log("Decoded token:", decoded);

        // Fetch user
        req.user = await User.findById(decoded.user.id).select('-password');
        if (!req.user) {
            return res.status(404).json({ error: 'User not found' });
        }
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        console.error('Error during token verification:', error.message);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = protect;
