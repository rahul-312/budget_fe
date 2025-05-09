import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/';

// API endpoints
export const API = {
  // Authentication
  REGISTER: `${BASE_URL}users/register/`,
  LOGIN: `${BASE_URL}users/login/`,
  LOGOUT: `${BASE_URL}users/logout/`,

  // Transactions
  TRANSACTIONS: `${BASE_URL}budget/transactions/`,

  // Budgets
  BUDGETS: `${BASE_URL}budget/budget/`,

  CATEGORIES: `${BASE_URL}budget/categories/`,
};

// Axios instance configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to retrieve authentication headers
export const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('No access token found. Please log in again.');
  }
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

// ------------------------
// Auth Functions
// ------------------------

export const register = async (userData) => {
  try {
    const response = await api.post(API.REGISTER, userData);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error?.response?.data || error.message);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post(API.LOGIN, credentials);
    const tokens = response?.data?.tokens;
    if (tokens) {
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
    } else {
      throw new Error('Tokens not found in the response');
    }
    return response.data;
  } catch (error) {
    console.error('Login failed:', error?.response?.data || error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token found. Please log in again.');
    }
    const response = await api.post(
      API.LOGOUT,
      { refresh: refreshToken },
      { headers: getAuthHeaders() }
    );
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return response.data;
  } catch (error) {
    console.error('Logout failed:', error?.response?.data || error.message);
    throw error;
  }
};

// ------------------------
// Transactions API
// ------------------------

export const fetchTransactions = async () => {
  try {
    const response = await api.get(API.TRANSACTIONS, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Fetching transactions failed:', error?.response?.data || error.message);
    throw error;
  }
};

export const createTransaction = async (data) => {
  try {
    const response = await api.post(API.TRANSACTIONS, data, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Creating transaction failed:', error?.response?.data || error.message);
    throw error;
  }
};

export const updateTransaction = async (id, data) => {
  try {
    const response = await api.put(`${API.TRANSACTIONS}${id}/`, data, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Updating transaction failed:', error?.response?.data || error.message);
    throw error;
  }
};

export const deleteTransaction = async (id) => {
  try {
    const response = await api.delete(`${API.TRANSACTIONS}${id}/`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Deleting transaction failed:', error?.response?.data || error.message);
    throw error;
  }
};

// ------------------------
// Budgets API
// ------------------------

export const fetchBudgets = async () => {
  try {
    const response = await api.get(API.BUDGETS, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Fetching budgets failed:', error?.response?.data || error.message);
    throw error;
  }
};

export const createBudget = async (data) => {
  try {
    const response = await api.post(API.BUDGETS, data, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Creating budget failed:', error?.response?.data || error.message);
    throw error;
  }
};

export const updateBudget = async (id, data) => {
  try {
    const response = await api.put(`${API.BUDGETS}${id}/`, data, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Updating budget failed:', error?.response?.data || error.message);
    throw error;
  }
};

export const deleteBudget = async (id) => {
  try {
    const response = await api.delete(`${API.BUDGETS}${id}/`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Deleting budget failed:', error?.response?.data || error.message);
    throw error;
  }
};



export const fetchCategories = async () => {
  try {
    const response = await api.get(API.CATEGORIES, { headers: getAuthHeaders() });
    return response.data;  // Return the data from the categories endpoint
  } catch (error) {
    console.error('Fetching categories failed:', error?.response?.data || error.message);
    throw error;
  }
};