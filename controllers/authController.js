const authModel = require('../models/authModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const transporter = require('./emailService'); 

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance using the authModel schema
        const user = new authModel({ name, email, password: hashedPassword });

        // Save the new user to the database
        await user.save();

        // Respond with a success message
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        // Handle registration errors
        res.status(500).json({ error: error.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await authModel.findOne({ email });

        if (!user) {
            // If user not found, return 404 status with a message
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the provided password matches the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            // If password is invalid, return 401 status with a message
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token for authentication
        const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });

        // Respond with the generated token
        res.status(200).json({ token });
    } catch (error) {
        // Handle login errors
        res.status(500).json({ error: error.message });
    }
};

// forget Password - Initiating the reset password process

// Reset Password using the reset token
exports.resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        // Find user by reset token
        const user = await authModel.findOne({ resetToken });

        if (!user) {
            // If user not found or invalid token, return 404 status with a message
            return res.status(404).json({ message: 'Invalid or expired reset token' });
        }

        // Verify and decode the reset token
        jwt.verify(resetToken, 'your_reset_secret_key', async (err, decoded) => {
            if (err) {
                // If token verification fails, return 401 status with a message
                return res.status(401).json({ message: 'Invalid or expired reset token' });
            }

            // Hash the new password before updating
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update user's password with the new hashed password and clear the resetToken field
            user.password = hashedPassword;
            user.resetToken = null;
            await user.save();

            // Respond with a success message
            res.status(200).json({ message: 'Password reset successful' });
        });
    } catch (error) {
        // Handle reset password errors
        res.status(500).json({ error: error.message });
    }
};

// Import the Nodemailer transporter

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // Find the user by email
    const user = await authModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign({ userId: user._id }, '0509769273', { expiresIn: '30m' });

    user.resetToken = resetToken;
    await user.save();

    const resetLink = `http://localhost:5000/auth/reset-password${resetToken}`;

    // Sending the password reset email
    const mailOptions = {
      from: 'sabesofteng@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `Click the link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send reset email' });
      }
      console.log('Password reset email sent:', info.response);
      return res.status(200).json({ message: 'Reset password link sent successfully' });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
