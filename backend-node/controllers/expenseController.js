const { expenses, getNextId } = require("../models/expenseModel");

// Get all expenses
exports.getAllExpenses = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: expenses,
      count: expenses.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching expenses",
      error: error.message,
    });
  }
};

// Add a new expense
exports.createExpense = (req, res) => {
  try {
    // Accept either 'vendor' (from upload) or 'description' (legacy)
    const { vendor, description, amount, category, date, currency, items } = req.body;
    const expenseDesc = vendor || description;

    // Validation
    if (!expenseDesc || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: vendor/description, amount, category, date",
      });
    }

    // Ensure amount is a number
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a valid number greater than 0",
      });
    }

    const newExpense = {
      id: getNextId(),
      description: expenseDesc,
      amount: parsedAmount,
      category,
      date,
      currency: currency || 'INR',
      items: items || [],
    };

    expenses.push(newExpense);

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: newExpense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating expense",
      error: error.message,
    });
  }
};

// Delete an expense
exports.deleteExpense = (req, res) => {
  try {
    const { id } = req.params;

    const index = expenses.findIndex((expense) => expense.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Expense with id ${id} not found`,
      });
    }

    const deletedExpense = expenses.splice(index, 1);

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
      data: deletedExpense[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting expense",
      error: error.message,
    });
  }
};

// Get expense by ID
exports.getExpenseById = (req, res) => {
  try {
    const { id } = req.params;

    const expense = expenses.find((exp) => exp.id === parseInt(id));

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: `Expense with id ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching expense",
      error: error.message,
    });
  }
};

// Update an expense
exports.updateExpense = (req, res) => {
  try {
    const { id } = req.params;
    const { vendor, description, amount, category, date } = req.body;

    const expense = expenses.find((exp) => exp.id === parseInt(id));

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: `Expense with id ${id} not found`,
      });
    }

    // Update fields if provided
    if (vendor || description) expense.description = vendor || description;
    if (amount) {
      const parsedAmount = parseFloat(amount);
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        expense.amount = parsedAmount;
      }
    }
    if (category) expense.category = category;
    if (date) expense.date = date;

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating expense",
      error: error.message,
    });
  }
};
