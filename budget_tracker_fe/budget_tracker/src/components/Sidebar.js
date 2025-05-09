import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import { logout } from "../api";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-links">
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/transactions">Transactions</Link></li>
          <li><Link to="/budgets">Budgets</Link></li>
        </ul>
      </div>
      <div className="sidebar-logout">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
