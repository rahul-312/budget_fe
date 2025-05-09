import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Transactions from "./pages/Transactions/Transactions";
import Budgets from "./pages/Budgets/Budgets";
import Dashboard from "./pages/Dashboard/Dashboard";  // Import Dashboard component

import "font-awesome/css/font-awesome.min.css";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();

  const showSidebarRoutes = [
    "/dashboard",
    "/transactions",
    "/budgets"
  ];

  const showSidebar = showSidebarRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        {showSidebar && <Sidebar />}
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} /> {/* Add Dashboard route */}
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budgets" element={<Budgets />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
