//expenseController.js
const Expense = require('../models/expenseModel');
const { generatePDF } = require('./pdfGenerator');

const ExpenseController = {
  addExpense: async (req, res) => {
    try {
      const { description, amount, category, date } = req.body;
      const newExpense = new Expense({
        description,
        amount,
        category,
        date,
        user: req.user._id, 
      });
      await newExpense.save();
      res.status(201).json({ message: 'Expense added successfully', expense: newExpense });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },


  editExpense: async (req, res) => {
    try {
      const { description, amount, category, date } = req.body;
      const expenseId = req.params.id;
      const expense = await Expense.findOne({ _id: expenseId, user: req.user._id });

      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
      }

      expense.description = description;
      expense.amount = amount;
      expense.category = category;
      expense.date = date;

      await expense.save();
      res.status(200).json({ message: 'Expense updated successfully', expense });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteExpense: async (req, res) => {
    try {
      const expenseId = req.params.id;
      const deletedExpense = await Expense.findOneAndDelete({ _id: expenseId, user: req.user._id });

      if (!deletedExpense) {
        return res.status(404).json({ message: 'Expense not found' });
      }

      res.status(200).json({ message: 'Expense deleted successfully', expense: deletedExpense });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllExpenses: async (req, res) => {
    try {
      const expenses = await Expense.find({ user: req.user._id });
      res.status(200).json({ expenses });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getExpensesByMonthAndYear: async (req, res) => {
    try {
      const { userId } = req.params;
      const { year, month } = req.query;
  
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(year, month, 0);
  
      const expenses = await Expense.find({
        user: userId,
        date: { $gte: startDate, $lte: endDate },
      });
  
      res.status(200).json({ expenses });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  generateExpenseReportPDF: async (req, res) => {
    try {
      const { userId } = req.params;
      const { startDate, endDate } = req.query;

      const pdfBuffer = await generatePDF(userId, startDate, endDate);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=expense_report.pdf`);
      res.status(200).send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = ExpenseController;
