import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function LineChartCard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null); // Clear error at start
    try {
      const response = await fetch('http://localhost:5000/api/analytics');
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const result = await response.json();
      
      // Check if response has success flag
      if (!result || result.success !== true) {
        // Backend returned but didn't confirm success - treat as empty, not error
        setData([]);
        setError(null); // No error, just no data
        return;
      }

      // Safely handle monthlyData - could be undefined or empty array
      const monthlyData = result.monthlyData || [];
      if (Array.isArray(monthlyData) && monthlyData.length > 0) {
        // Ensure all amounts are numbers
        const sanitizedData = monthlyData.map(d => ({
          month: String(d.month || ''),
          amount: Number(d.amount) || 0
        })).filter(d => d.amount > 0);
        
        setData(sanitizedData);
        setError(null); // Ensure error is cleared
      } else {
        setData([]);
        setError(null);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load analytics');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    
    // Listen for expense changes to refresh data
    const handleExpenseChange = () => {
      setTimeout(fetchAnalytics, 500);
    };
    
    window.addEventListener('expenseAdded', handleExpenseChange);
    window.addEventListener('expenseDeleted', handleExpenseChange);
    
    return () => {
      window.removeEventListener('expenseAdded', handleExpenseChange);
      window.removeEventListener('expenseDeleted', handleExpenseChange);
    };
  }, []);

  // Safe calculation with edge case handling for single or zero data points
  const validData = data.filter(d => typeof d.amount === 'number' && d.amount > 0);
  const max = validData.length > 0 ? Math.max(...validData.map(d => Number(d.amount) || 0)) : 100;
  
  const points = validData.length > 1 
    ? validData.map((d, i) => {
        const x = 20 + (i * 80) / (validData.length - 1);
        const y = 100 - ((Number(d.amount) || 0) / max) * 80;
        return `${x},${y}`;
      }).join(" ")
    : validData.length === 1 
    ? `60,${100 - (Number(validData[0].amount) || 0) / max * 80}`
    : "";

  return (
    <motion.div 
      className="bg-white rounded-xl shadow p-6 flex flex-col gap-2" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="font-semibold mb-2">Monthly Expenses</h2>
      
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-32 text-red-500">
          <div className="text-center">
            <p className="text-sm">{error}</p>
            <button 
              onClick={fetchAnalytics}
              className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <>
          <svg width={120} height={120} viewBox="0 0 120 120" className="mx-auto">
            {validData.length > 0 ? (
              <>
                {validData.length > 1 && (
                  <polyline points={points} fill="none" stroke="#6366f1" strokeWidth={3} />
                )}
                {validData.map((d, i) => {
                  const x = validData.length > 1 
                    ? 20 + (i * 80) / (validData.length - 1)
                    : 60;
                  const y = 100 - ((Number(d.amount) || 0) / max) * 80;
                  return <circle key={i} cx={x} cy={y} r={4} fill="#6366f1" />;
                })}
              </>
            ) : (
              <text x="60" y="60" textAnchor="middle" fill="#bbb">No data</text>
            )}
          </svg>
          
          <ul className="mt-2 text-sm">
            {validData.length === 0 ? (
              <li className="text-gray-400">No data available.</li>
            ) : (
              validData.map((d, i) => (
                <li key={i}>{d.month}: ₹{(Number(d.amount) || 0).toFixed(0)}</li>
              ))
            )}
          </ul>
        </>
      )}
    </motion.div>
  );
}
