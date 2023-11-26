const mongoose = require('mongoose');
const authModel = require('./authModel'); 

// Expense schema
const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'authModel', 
  },
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
