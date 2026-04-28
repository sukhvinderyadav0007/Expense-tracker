import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Target, TrendingUp, AlertTriangle } from "lucide-react";

export default function BudgetProgressCard() {
  const [budget, setBudget] = useState(10000);
  const [spent, setSpent] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [showBudgetSetter, setShowBudgetSetter] = useState(false);
  const [newBudget, setNewBudget] = useState("10000");

  useEffect(() => {
    fetchExpenses();

    const handleExpenseAdded = () => {
      fetchExpenses();
    };

    window.addEventListener("expenseAdded", handleExpenseAdded);
    return () =>
      window.removeEventListener("expenseAdded", handleExpenseAdded);
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/expenses");

      if (response.ok) {
        const data = await response.json();

        // ✅ FIX: backend se direct array aata hai
        const expensesArray = Array.isArray(data) ? data : [];

        const currentMonth = new Date().toISOString().slice(0, 7);

        const monthlyExpenses = expensesArray.filter(
          (expense) =>
            expense?.date && expense.date.startsWith(currentMonth)
        );

        const totalSpent = monthlyExpenses.reduce(
          (sum, expense) => sum + (expense.amount || 0),
          0
        );

        setSpent(totalSpent);
        setExpenses(monthlyExpenses);
      } else {
        setExpenses([]);
        setSpent(0);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenses([]);
      setSpent(0);
    }
  };

  const percent = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const remaining = budget - spent;
  const isOverBudget = spent > budget;

  const handleBudgetUpdate = () => {
    const budgetValue = Number(newBudget);
    if (budgetValue > 0) {
      setBudget(budgetValue);
      setShowBudgetSetter(false);
      localStorage.setItem("monthlyBudget", budgetValue.toString());
    }
  };

  useEffect(() => {
    const savedBudget = localStorage.getItem("monthlyBudget");
    if (savedBudget && parseFloat(savedBudget) > 0) {
      const budgetValue = parseFloat(savedBudget);
      setBudget(budgetValue);
      setNewBudget(budgetValue.toString());
    }
  }, []);

  const getProgressColor = () => {
    if (isOverBudget) return "bg-red-500";
    if (percent > 80) return "bg-yellow-500";
    if (percent > 60) return "bg-orange-500";
    return "bg-green-500";
  };

  const getStatusIcon = () => {
    if (isOverBudget)
      return <AlertTriangle size={16} className="text-red-500" />;
    if (percent > 80)
      return <TrendingUp size={16} className="text-yellow-500" />;
    return <Target size={16} className="text-green-500" />;
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow p-6 flex flex-col gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <h2 className="font-semibold">Monthly Budget Utilization</h2>
        </div>

        <button
          onClick={() => {
            setNewBudget(budget.toString());
            setShowBudgetSetter(!showBudgetSetter);
          }}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Budget Setter */}
      {showBudgetSetter && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <input
            type="number"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleBudgetUpdate}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Set Budget
          </button>
        </div>
      )}

      {/* Progress */}
      <div className="w-full bg-gray-200 h-6 rounded-full overflow-hidden">
        <div
          className={`h-6 ${getProgressColor()}`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>

      {/* Stats */}
      <div className="flex justify-between text-sm">
        <span>₹{spent.toFixed(2)} spent</span>
        <span>₹{budget}</span>
        <span>{percent.toFixed(1)}%</span>
      </div>

      {/* Extra */}
      <div className="flex justify-between text-sm">
        <span>Remaining: ₹{remaining.toFixed(2)}</span>
        <span>Transactions: {expenses.length}</span>
      </div>

      {isOverBudget && (
        <div className="text-red-600 text-sm">
          ⚠ Over Budget by ₹{Math.abs(remaining).toFixed(2)}
        </div>
      )}
    </motion.div>
  );
}