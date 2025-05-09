import React, { useEffect, useState } from 'react';
import { fetchTransactions, createTransaction, fetchCategories } from '../../api';  // Importing necessary functions
import { useNavigate } from 'react-router-dom';  // Navigation for routing

import './Transactions.css';

const TransactionsPage = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    category: '',
    description: '',
    date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load transactions and categories on component mount
  useEffect(() => {
    loadTransactions();
    loadCategories();
  }, []);

  // Function to load all transactions
  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await fetchTransactions();
      setTransactions(data);
    } catch (err) {
      setError('Error fetching transactions.');
    } finally {
      setLoading(false);
    }
  };

  // Function to load categories
  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      console.log(data); // Log the categories data to the console
      setCategories(data);  // Set categories in state
    } catch (err) {
      setError('Error fetching categories.');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({
      ...newTransaction,
      [name]: value,
    });
  };

  // Handle form submission to create a new transaction
  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTransaction(newTransaction);  // Call the API to create the transaction
      setNewTransaction({ amount: '', category: '', description: '', date: '' });  // Reset form fields
      loadTransactions();  // Reload transactions
    } catch (err) {
      setError('Error creating transaction.');
    } finally {
      setLoading(false);
    }
  };

  // Rendering the page
  return (
    <div className="transactions-container">
      <h1>Transactions</h1>

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Create Transaction Form */}
      <h2>Create New Transaction</h2>
      <form onSubmit={handleCreateTransaction}>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={newTransaction.amount}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={newTransaction.category}
            onChange={handleInputChange}
            required
            >
            <option value="">Select a category</option>
            {categories.map((category) => (
                <option key={category.value} value={category.value}>
                {category.label}
                </option>
            ))}
            </select>
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={newTransaction.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={newTransaction.date}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Transaction'}
        </button>
      </form>

      {/* Transactions List */}
      <h2>Transaction List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.amount}</td>
                  <td>{transaction.category_display}</td>
                  <td>{transaction.description}</td>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionsPage;
