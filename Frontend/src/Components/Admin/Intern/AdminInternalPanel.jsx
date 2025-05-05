import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo_icon from "../../../assets/logo_icon.png";
import UsersComponent from "./UsersComponent";
import VerifyCompanies from "./VerifyCompanies";
import CompanyManagement from "./CompaniesTable";
import LogsDownload from "./LogsDownload";
import AccessDenied from "./AccessDenied";

const AdminInternalPanel = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedPermissions =
      JSON.parse(localStorage.getItem("permissions")) || [];
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
        return permissions.includes("READ_USERS") ? (
          <div className="mt-13">
            <UsersComponent />
          </div>
        ) : (
          <div>Access Denied</div>
        );
      case "verify-companies":
        return permissions.includes("VERIFY_COMPANY") ? (
          <div>
            <VerifyCompanies />
          </div>
        ) : (
          <div>Access Denied</div>
        );
      case "manage-companies":
        return permissions.includes("UPDATE_COMPANY") ? (
          <div>
            <CompanyManagement />
          </div>
        ) : (
          <div>Access Denied</div>
        );
        case "download-logs":
          return permissions.includes("READ_LOGS") ? (
            <div>
              <LogsDownload />
            </div>
          ) : (
            <div>Access Denied</div>
          );
      case "manage-roles":
        return permissions.includes("READ_ROLES") ? (
          <div>
            <h1 className="text-2xl font-bold">Manage Roles</h1>
            <p>Manage roles and permissions here.</p>
          </div>
        ) : (
          <div>
            <AccessDenied />
          </div>
        );

      default:
        return <div>Dashboard</div>;
    }
  };

  return (
    <div className="flex">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-green-500 text-white p-4 shadow-md flex items-center">
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
          <span className="text-xl font-semibold">Worksy Admin Panel</span>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-green-100 p-5 transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 shadow-md`}
      >
        <ul className="mt-16">
          {permissions.includes("READ_USERS") && (
            <li>
              <button
                onClick={() => navigate("?active-tab=users")}
                className=" cursor-pointer block w-full text-left p-3 rounded-md text-green-700 hover:bg-green-200"
              >
                Users
              </button>
            </li>
          )}
          {permissions.includes("VERIFY_COMPANY") && (
            <li>
              <button
                onClick={() => navigate("?active-tab=verify-companies")}
                className=" cursor-pointer w-full text-left p-3 rounded-md text-green-700 hover:bg-green-200 flex justify-between"
              >
                Verify Companies
              </button>
            </li>
          )}
          {permissions.includes("UPDATE_COMPANY") && (
            <li>
              <button
                onClick={() => navigate("?active-tab=manage-companies")}
                className=" cursor-pointer w-full text-left p-3 rounded-md text-green-700 hover:bg-green-200 flex justify-between"
              >
                Manage Companies
              </button>
            </li>
          )}
          {permissions.includes("READ_LOGS") && (
            <li>
              <button
                onClick={() => navigate("?active-tab=download-logs")}
                className=" cursor-pointer block w-full text-left p-3 rounded-md text-green-700 hover:bg-green-200"
              >
                Download Logs
              </button>
            </li>
          )}
           {permissions.includes("READ_ROLES") && (
            <li>
              <button
                onClick={() => navigate("?active-tab=manage-roles")}
                className=" cursor-pointer block w-full text-left p-3 rounded-md text-green-700 hover:bg-green-200"
              >
                Manage Roles
              </button>
            </li>
          )}
          <li>
            <button
              onClick={handleLogout}
              className="block w-full text-left p-3 rounded-md text-green-700 hover:bg-red-300 bg-red-200"
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

export default AdminInternalPanel;
