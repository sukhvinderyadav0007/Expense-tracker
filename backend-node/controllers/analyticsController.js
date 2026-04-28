const { expenses } = require("../models/expenseModel");

// Get analytics data (category-wise and monthly totals)
exports.getAnalytics = (req, res) => {
  try {
    if (!expenses || expenses.length === 0) {
      return res.status(200).json({
        success: true,
        categoryData: [],
        monthlyData: [],
        totalExpenses: 0,
        averageExpense: 0,
        transactionCount: 0,
      });
    }

    // Category-wise calculation
    const categoryTotals = {};
    expenses.forEach((expense) => {
      // Safe amount parsing
      const amount = parseFloat(expense.amount) || 0;
      if (amount <= 0) return; // Skip invalid amounts
      
      const category = String(expense.category || "Uncategorized").trim();
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += amount;
    });

    const categoryData = Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value: Math.max(0, parseFloat((value || 0).toFixed(2))), // Ensure positive number
      }))
      .filter(d => d.value > 0)
      .sort((a, b) => b.value - a.value); // Sort by highest amount first

    // Monthly calculation
    const monthlyTotals = {};
    expenses.forEach((expense) => {
      const amount = parseFloat(expense.amount) || 0;
      if (amount <= 0) return; // Skip invalid amounts
      
      // Safely extract month from date
      const dateStr = String(expense.date || "");
      const month = dateStr.substring(0, 7) || "Unknown";
      
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = 0;
      }
      monthlyTotals[month] += amount;
    });

    const monthlyData = Object.entries(monthlyTotals)
      .sort()
      .map(([month, amount]) => ({
        month,
        amount: Math.max(0, parseFloat((amount || 0).toFixed(2))), // Ensure positive number
      }))
      .filter(d => d.amount > 0); // Remove zero entries

    // Calculate totals and average
    const validExpenses = expenses.filter(e => (parseFloat(e.amount) || 0) > 0);
    const totalExpenses = validExpenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
    const averageExpense = validExpenses.length > 0 ? totalExpenses / validExpenses.length : 0;

    res.status(200).json({
      success: true,
      categoryData,
      monthlyData,
      totalExpenses: Math.max(0, parseFloat(totalExpenses.toFixed(2))),
      averageExpense: Math.max(0, parseFloat(averageExpense.toFixed(2))),
      transactionCount: validExpenses.length,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching analytics",
      error: error.message,
    });
  }
};
