import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Transactions from "./pages/Transactions/Transactions";
import EditTransactionPage from "./pages/Transactions/EditTransactionPage";
import Budgets from "./pages/Budgets/Budgets";
import Dashboard from "./pages/Dashboard/Dashboard";
import "font-awesome/css/font-awesome.min.css";
import "./styles/App.css";

// Function to check if user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};

// Wrapper to protect private routes
const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Redirect root to login */}
          <Route index element={<Navigate to="/login" replace />} />

          {/* Public Routes */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="transactions/:id/edit" element={<EditTransactionPage />} />
            <Route path="budgets" element={<Budgets />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
