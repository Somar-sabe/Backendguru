//expenseRoute.js
const express = require('express');
const router = express.Router();
const ExpenseController = require('../controllers/expenseController');

// POST endpoint for adding an expense
router.post('/', ExpenseController.addExpense);

// PUT endpoint for editing an expense by ID
router.put('/:id', ExpenseController.editExpense);

// DELETE endpoint for deleting an expense by ID
router.delete('/:id', ExpenseController.deleteExpense);

// GET endpoint for fetching all expenses of the logged-in user
router.get('/', ExpenseController.getAllExpenses);


// GET endpoint for filtering expenses by month and year
router.get('/monthly/:userId', ExpenseController.getExpensesByMonthAndYear);

// GET endpoint for generating and downloading expense report in PDF format
router.get('/pdf-download/:userId', ExpenseController.generateExpenseReportPDF);

module.exports = router;
