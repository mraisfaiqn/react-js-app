import { useState } from 'react'

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [filter, setFilter] = useState('all');

  // Categories available
  const categories = [
    "food",
    "transport",
    "entertainment",
    "utilities",
    "healthcare",
    "other",
  ];

  // Add new expense
  const addExpense = () => {
    if (description.trim() && amount && parseFloat(amount) > 0) {
      const newExpense = {
        id: Date.now(),
        description: description.trim(),
        amount: parseFloat(amount),
        category: category,
      };
      setExpenses([...expenses, newExpense]);
      // Reset form
      setDescription("");
      setAmount("");
      setCategory("food");
    }
  };

  // Delete individual expense
  const deleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  // Filter expenses by category
  const getFilteredExpenses = () => {
    if (filter === "all") {
      return expenses;
    }
    return expenses.filter((expense) => expense.category === filter);
  };

  // Calculate total expenses
  const getTotalExpenses = () => {
    const filteredExpenses = getFilteredExpenses();
    return filteredExpenses
      .reduce((total, expense) => total + expense.amount, 0)
      .toFixed(2);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    addExpense();
  };

  return (
    <div className="expense-container">
      <h2 className="expense-title">Personal Expense Tracker</h2>

      {/* Form to add expenses */}
      <div className="form-section">
        <h3 className="section-title">Add New Expense</h3>
        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-row">
            <input
              className="expense-input"
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              className="expense-input"
              type="number"
              placeholder="Amount"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="form-row">
            <select
              className="expense-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            <button type="submit" className="add-expense-btn">
              Add Expense
            </button>
          </div>
        </form>
      </div>

      {/* Filter dropdown */}
      <div className="filter-section">
        <h3 className="section-title">Filter Expenses</h3>
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Total calculation */}
      <div className="total-section">
        <h3 className="total-title">
          Total: ${getTotalExpenses()}
          {filter !== "all" && <span className="filter-info"> ({filter})</span>}
        </h3>
      </div>

      {/* Expenses list */}
      <div className="expenses-section">
        <h3 className="section-title">
          Expenses List
          {filter !== "all" && <span className="filter-badge">({filter})</span>}
        </h3>

        {getFilteredExpenses().length === 0 ? (
          <p className="no-expenses">
            {filter === "all"
              ? "No expenses added yet"
              : `No expenses in ${filter} category`}
          </p>
        ) : (
          <div className="expenses-list">
            {getFilteredExpenses().map((expense) => (
              <div key={expense.id} className="expense-item">
                <div className="expense-info">
                  <div className="expense-description">
                    {expense.description}
                  </div>
                  <div className="expense-details">
                    <span className="expense-amount">
                      ${expense.amount.toFixed(2)}
                    </span>
                    <span className="expense-category">{expense.category}</span>
                  </div>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => deleteExpense(expense.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* State Display */}
      <div className="state-display">
        <h3 className="state-title">Current State:</h3>
        <p className="state-info">Total Expenses: {expenses.length}</p>
        <p className="state-info">
          Filtered Expenses: {getFilteredExpenses().length}
        </p>
        <p className="state-info">Current Filter: {filter}</p>
      </div>
    </div>
  );

}

export default ExpenseTracker;
