import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C',
  '#8DD1E1', '#D084D0'
];

function getPieSegments(data) {
  if (!data || data.length === 0) return [];
  
  // Ensure all values are numbers and positive
  const sanitizedData = data.map(d => ({
    ...d,
    value: Math.max(0, Number(d.value) || 0)
  })).filter(d => d.value > 0);
  
  if (sanitizedData.length === 0) return [];
  
  const total = sanitizedData.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  if (total === 0) return [];
  
  let startAngle = 0;
  return sanitizedData.map((d, index) => {
    const angle = ((Number(d.value) || 0) / total) * 360;
    const segment = {
      ...d,
      startAngle,
      endAngle: startAngle + angle,
      color: COLORS[index % COLORS.length]
    };
    startAngle += angle;
    return segment;
  });
}

export default function PieChartCard() {
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

      // Safely handle categoryData - could be undefined or empty array
      const categoryData = result.categoryData || [];
      if (Array.isArray(categoryData) && categoryData.length > 0) {
        // Ensure all values are numbers
        const sanitizedData = categoryData.map(d => ({
          name: String(d.name || 'Unknown'),
          value: Number(d.value) || 0
        })).filter(d => d.value > 0);
        
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

  const segments = getPieSegments(data);

  return (
    <motion.div 
      className="bg-white rounded-xl shadow p-6 flex flex-col gap-2" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="font-semibold mb-2">Expenses by Category</h2>
      
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
            {segments && segments.length > 0 ? (
              segments.map((seg, i) => {
                const largeArc = seg.endAngle - seg.startAngle > 180 ? 1 : 0;
                const r = 50;
                const cx = 60, cy = 60;
                
                // Safely convert angles to numbers
                const startAngle = Number(seg.startAngle) || 0;
                const endAngle = Number(seg.endAngle) || 0;
                
                const start = [
                  cx + r * Math.cos((Math.PI * startAngle) / 180),
                  cy + r * Math.sin((Math.PI * startAngle) / 180),
                ];
                const end = [
                  cx + r * Math.cos((Math.PI * endAngle) / 180),
                  cy + r * Math.sin((Math.PI * endAngle) / 180),
                ];
                
                return (
                  <path
                    key={i}
                    d={`M${cx},${cy} L${start[0]},${start[1]} A${r},${r} 0 ${largeArc},1 ${end[0]},${end[1]} Z`}
                    fill={seg.color}
                    opacity={0.9}
                  />
                );
              })
            ) : (
              <text x="60" y="60" textAnchor="middle" fill="#bbb">No data</text>
            )}
          </svg>
          
          <ul className="mt-2 text-sm">
            {data.length === 0 ? (
              <li className="text-gray-400">No data available.</li>
            ) : (
              data.map((d, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span 
                    className="inline-block w-3 h-3 rounded-full" 
                    style={{ background: COLORS[i % COLORS.length] }}
                  ></span>
                  {d.name}: ₹{(Number(d.value) || 0).toFixed(0)}
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </motion.div>
  );
}
