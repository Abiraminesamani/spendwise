# SpendWise - Expense Tracker Frontend

A React-based expense tracking frontend demo.

## Project Structure

```
spendwise/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                    # Entry point
    ├── App.jsx                     # Root component + state management
    ├── data/
    │   └── constants.js            # Theme colors, initial data, constants
    ├── utils/
    │   └── helpers.js              # fmt(), getStyles() utilities
    └── components/
        ├── Dashboard.jsx           # Overview: summary cards, recent txns, accounts
        ├── Transactions.jsx        # Full transaction list
        ├── Accounts.jsx            # Account balance cards
        ├── Budgets.jsx             # Budget progress bars per category
        ├── Categories.jsx          # Category management grid
        └── Modal.jsx               # Shared modal for all add/create forms
```

## Getting Started

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Features
- User-based expense tracking
- Multiple account balance management (auto-updates on transaction)
- Insufficient balance prevention
- Categorized expenses with unique names per user
- Payment method tracking (cash, UPI, card, bank)
- Budget management with visual progress bars
- Automatic monthly summary (income, expenses, savings)
- Data validation and error handling
