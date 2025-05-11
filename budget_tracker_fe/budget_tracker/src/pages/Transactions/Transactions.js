import React, { useEffect, useState } from 'react';
import { fetchTransactions, createTransaction, fetchCategories, deleteTransaction } from '../../api'; // Ensure deleteTransaction is imported
import { useNavigate } from 'react-router-dom';

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
  const [successMessage, setSuccessMessage] = useState('');
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    loadTransactions();
    loadCategories();
  }, []);

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

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      setError('Error fetching categories.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({
      ...newTransaction,
      [name]: value,
    });
  };

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    try {
      await createTransaction(newTransaction);
      setSuccessMessage('Transaction created and budget updated!');
      setNewTransaction({ amount: '', category: '', description: '', date: '' });
      loadTransactions();
      setShowList(true);
    } catch (err) {
      setError('Error creating transaction.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      setSuccessMessage('Transaction deleted successfully.');
      loadTransactions(); // Reload transactions after deletion
    } catch (err) {
      setError('Error deleting transaction.');
    }
  };

  const handleEditTransaction = (id) => {
    navigate(`/transactions/${id}/edit`);
  };

  return (
    <div className="transactions-container">
      <h1>Transactions</h1>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      {/* Toggle Button */}
      <button onClick={() => setShowList(!showList)} className="toggle-button">
        {showList ? 'Add New Transaction' : 'Transactions List'}
      </button>

      {showList ? (
        <>
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
                  <th>Actions</th>
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
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleEditTransaction(transaction.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default TransactionsPage;
