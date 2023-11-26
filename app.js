const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const authRouter = require('./routes/authRoute'); 
const expenseRouter = require('./routes/expenseRoute'); 
const jwt = require('jsonwebtoken');

require('dotenv').config(); // Load environment variables

// Middleware
app.use(express.json()); // Middleware to parse incoming JSON payloads
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

app.use('/auth', authRouter);
app.use('/expenses', expenseRouter);

// Authentication middleware
app.use((req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({ message: 'Token verification failed' });
    } else {
      req.user = decoded;
      next();
    }
  });
});

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Expense Management API!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Something went wrong' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
