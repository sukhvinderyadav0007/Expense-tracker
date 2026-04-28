// In-memory storage for expenses
let expenses = [
  {
    id: 1,
    description: "Grocery Shopping",
    amount: 45.50,
    category: "Food",
    date: "2025-04-20",
  },
  {
    id: 2,
    description: "Gas",
    amount: 60.00,
    category: "Transportation",
    date: "2025-04-21",
  },
  {
    id: 3,
    description: "Netflix Subscription",
    amount: 15.99,
    category: "Entertainment",
    date: "2025-04-22",
  },
];

let nextId = 4; // For generating new IDs

module.exports = {
  expenses,
  getNextId: () => nextId++,
};
