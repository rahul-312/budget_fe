import React, { useEffect, useState } from 'react';
import { fetchBudgets, createBudget, updateBudget, deleteBudget } from '../../api';
import DatePicker from 'react-datepicker';  // Import react-datepicker
import SweetAlert from 'sweetalert2'; // Import SweetAlert
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS for react-datepicker
import './Budget.css';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(null);

  const loadBudgets = async () => {
    try {
      const data = await fetchBudgets();
      setBudgets(data);
    } catch (err) {
      SweetAlert.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error fetching budgets.',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure amount and date are selected
    if (!amount || !date) {
      SweetAlert.fire({
        icon: 'warning',
        title: 'Input Error',
        text: 'Please fill out all fields!',
      });
      return;
    }

    const month = date.getMonth() + 1; 
    const year = date.getFullYear();

    try {
      await createBudget({ amount, month, year });
      setAmount('');
      setDate(null);
      SweetAlert.fire({
        icon: 'success',
        title: 'Budget Created',
        text: 'Your budget has been successfully created.',
      });
      loadBudgets();
    } catch (err) {
      SweetAlert.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error creating the budget.',
      });
    }
  };

  const handleUpdate = async (budgetId) => {
    const { value: newAmount } = await SweetAlert.fire({
      title: 'Update Budget Amount',
      input: 'number',
      inputLabel: 'Enter the new amount',
      inputPlaceholder: 'New amount',
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) return 'Amount is required!';
        if (isNaN(value) || value <= 0) return 'Please enter a valid positive number!';
        return null;
      }
    });
  
    if (!newAmount) return;
  
    try {
      await updateBudget(budgetId, { amount: newAmount });
      SweetAlert.fire({
        icon: 'success',
        title: 'Budget Updated',
        text: 'Your budget has been updated successfully.',
      });
      loadBudgets();
    } catch (err) {
      SweetAlert.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error updating the budget.',
      });
    }
  };

  const handleDelete = async (budgetId) => {
    const result = await SweetAlert.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this budget!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteBudget(budgetId);
        SweetAlert.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The budget has been deleted.',
        });
        loadBudgets();
      } catch (err) {
        SweetAlert.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error deleting the budget.',
        });
      }
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  return (
    <div className="budgets-container">
      <h2 className="budgets-title">Budgets</h2>
      <form className="budget-form" onSubmit={handleSubmit}>
        <input
          className="budget-input"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        {/* Date Picker */}
        <div >
            Date : 
        </div>
        <DatePicker
          className="budget-input"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          required
        />
        <button type="submit" className="budget-button">Add Budget</button>
      </form>
      <ul className="budget-list">
        {budgets.map((budget) => (
          <li className="budget-item" key={budget.id}>
            <span>{budget.amount} - {budget.month}/{budget.year}</span>
            <button className="budget-edit-button" onClick={() => handleUpdate(budget.id)}>Edit</button>
            <button className="budget-delete-button" onClick={() => handleDelete(budget.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Budgets;
