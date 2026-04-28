# Smart Expense Tracker Backend

A simple Node.js Express backend API for the Smart Expense Tracker application with in-memory storage.

## Features

- ✅ REST API for managing expenses
- ✅ CORS enabled for frontend communication
- ✅ In-memory data storage (no database needed)
- ✅ Automatic server restart with Nodemon
- ✅ Simple and beginner-friendly code

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check if backend is running |
| GET | `/api/expenses` | Get all expenses |
| POST | `/api/expenses` | Create a new expense |
| GET | `/api/expenses/:id` | Get expense by ID |
| PUT | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |

## Setup Instructions

### Step 1: Open Terminal in backend-node folder

```bash
# Navigate to the backend-node directory
cd backend-node
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web framework
- `cors` - Enable cross-origin requests
- `dotenv` - Environment variables
- `nodemon` - Auto-reload during development

### Step 3: Start the Backend Server

```bash
npm start
```

You should see output like:
```
╔════════════════════════════════════════╗
║  Smart Expense Tracker Backend Running  ║
║  Port: 5000                            ║
║  URL: http://localhost:5000            ║
║  API: http://localhost:5000/api/expenses║
╚════════════════════════════════════════╝
```

### Step 4: Test the Backend

Open your browser and visit:
```
http://localhost:5000/api/expenses
```

You should see the sample expenses data in JSON format.

## Example API Usage

### Get All Expenses
```bash
curl http://localhost:5000/api/expenses
```

### Add New Expense
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Coffee",
    "amount": 5.50,
    "category": "Food",
    "date": "2025-04-27"
  }'
```

### Delete Expense
```bash
curl -X DELETE http://localhost:5000/api/expenses/1
```

### Update Expense
```bash
curl -X PUT http://localhost:5000/api/expenses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated Description",
    "amount": 100.00
  }'
```

## Frontend Connection

Your frontend is already configured to connect to this backend. Once both servers are running:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

The frontend will automatically fetch expenses from the backend API.

## Project Structure

```
backend-node/
├── server.js              # Main server file
├── package.json           # Project dependencies
├── .env                   # Environment variables
├── routes/
│   └── expenseRoutes.js   # API route definitions
├── controllers/
│   └── expenseController.js # Business logic
└── models/
    └── expenseModel.js    # Data storage & structure
```

## Notes

- Data is stored in-memory, so it will reset when the server restarts
- No database required - perfect for learning and prototyping
- CORS is enabled to allow requests from your frontend
- All responses follow a consistent JSON format with `success`, `message`, and `data` fields

## Troubleshooting

### Port 5000 is already in use?
Change the port in `.env`:
```
PORT=5001
```

### Module not found error?
Make sure you've installed dependencies:
```bash
npm install
```

### Frontend still shows "Backend Offline"?
1. Ensure backend is running on port 5000
2. Check browser console for CORS errors
3. Try visiting `http://localhost:5000/api/health` in your browser

## Ready to go!

Your backend is now ready to use with your frontend. Happy coding! 🚀
