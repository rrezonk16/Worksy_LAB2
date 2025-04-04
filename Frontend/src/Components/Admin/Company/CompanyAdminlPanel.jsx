import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo_icon from "../../../assets/logo_icon.png";


const CompanyAdminPanel = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermissions(storedPermissions);
  }, []);

  const getActiveTab = () => {
    const params = new URLSearchParams(location.search);
    return params.get("active-tab") || "users";
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const renderComponent = () => {
    switch (getActiveTab()) {
      case "users":
        return permissions.includes("READ_USERS") ? <div className="mt-13">OK</div> : <div>Access Denied</div>;
      case "verify-companies":
        return permissions.includes("EDIT_USERS") ? <div>OK</div> : <div>Access Denied</div>;
      default:
        return <div>Dashboard</div>;
    }
  };

  return (
    <div className="flex">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-gray-500 text-white p-4 shadow-md flex items-center">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="text-white p-2 rounded-md sm:hidden"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <div className="flex items-left">
          <img src={logo_icon} className="h-8 mr-3" alt="Worksy" />
          <span className="text-xl font-semibold">{JSON.parse(localStorage.getItem("company_information"))?.name} Panel</span>
          </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-100 p-5 transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 shadow-md`}
      >
        <ul className="mt-16">
   
          {permissions.includes("READ_USERS") && (
            <li>
              <button
                onClick={() => navigate("?active-tab=users")}
                className="block w-full text-left p-3 rounded-md text-gray-700 hover:bg-gray-200 cursor-pointer"
              >
                Company Users
              </button>
            </li>
          )}
          {permissions.includes("EDIT_USERS") && (
            <li>
              <button
                onClick={() => navigate("?active-tab=verify-companies")}
                className="w-full text-left p-3 rounded-md text-gray-700 hover:bg-gray-200 cursor-pointer flex justify-between"
              >
                Job Listings  
              </button>
            </li>
          )}
          <li>
            <button 
              onClick={handleLogout} 
              className="block w-full text-left p-3 cursor-pointer rounded-md text-white hover:bg-red-800 bg-red-500"
            >
              Log Out
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-6 w-full">{renderComponent()}</main>
    </div>
  );
};

export default CompanyAdminPanel;