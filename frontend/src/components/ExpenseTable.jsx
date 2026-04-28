import React, { useState, useEffect } from "react";
import { Search, Filter, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { formatDateInfo } from '../utils/dateUtils';

export default function ExpenseTable() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [date, setDate] = useState("");

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/expenses");
      const data = await response.json();

      // ✅ FIX: backend se direct array aata hai
      const expensesArray = Array.isArray(data) ? data : [];

      setExpenses(expensesArray);

    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Failed to connect to server");
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();

    const handleExpenseChange = () => {
      setTimeout(fetchExpenses, 300);
    };

    window.addEventListener("expenseAdded", handleExpenseChange);
    window.addEventListener("expenseDeleted", handleExpenseChange);

    return () => {
      window.removeEventListener("expenseAdded", handleExpenseChange);
      window.removeEventListener("expenseDeleted", handleExpenseChange);
    };
  }, []);

  // ✅ SAFE FILTER
  const filtered = (expenses || []).filter((e) =>
    (!search || e?.vendor?.toLowerCase().includes(search.toLowerCase())) &&
    (!category || category === "All Categories" || e?.category === category) &&
    (!date || e?.date === date)
  );

  const formatCurrency = (amount, currency = "INR") => {
    return currency === "INR"
      ? `₹${(amount || 0).toFixed(2)}`
      : `$${(amount || 0).toFixed(2)}`;
  };

  const categories = [
    "All Categories",
    ...new Set((expenses || []).map((e) => e?.category).filter(Boolean)),
  ];

  return (
    <motion.div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold">Expense History</h3>
        <button onClick={fetchExpenses}>
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1"
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <button onClick={fetchExpenses}>
          <Filter size={16} />
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filtered.length === 0 ? (
        <p>No expenses found</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id}>
                <td>{e.vendor}</td>
                <td>{formatCurrency(e.amount)}</td>
                <td>{e.category}</td>
                <td>{formatDateInfo(e.date).formatted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
}