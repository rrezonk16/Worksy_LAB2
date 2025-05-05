import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Error404 from "./Components/ErrorPages/Error404";
import Register from "./Components/Auth/Register";
import Login from "./Components/Auth/Login";
import AdminInternalPanel from "./Components/Admin/Intern/AdminInternalPanel";
import Main from "./assets/Main";
import CompanyVerificationForm from "./Components/Auth/CompanyVerificationForm";
import CompanyPanelLogin from "./Components/Auth/CompanyPanelLogin";
import isLoggedIn from "./Components/Functions/isLoggedIn";
import Unverified from "./Components/Admin/Company/Unverified";
import CompanyAdminlPanel from "./Components/Admin/Company/CompanyAdminlPanel";
import Welcome from "./Components/Auth/welcome";
import JobListings from "./Components/Main/JobListings";
import JobListingsById from "./Components/Main/JobListingsById";
import MyApplications from "./Components/Jobs/MyApplications";
import ErrorBoundary from "./Components/Functions/ErrorBoundary";
import Profile from "./Components/Admin/User/Profile";
import ForgotPasswordFlow from "./Components/Auth/Password/ForgotPasswordFlow";
import Subscribe from "./Components/Premium/Subscribe";
import Checkout from "./Components/Premium/Checkout";
import Success from "./Components/Premium/Success";
import Rejected from "./Components/Admin/Company/Rejected";
import WelcomeCompany from "./Components/Employers/WelcomeCompany";
import SubscribePage from "./Components/Premium/SubscribePage";
import ApplicationsDetails from "./Components/Jobs/ApplicationsDetails";

const routes = [
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/company/panel/login",
    element: <CompanyPanelLogin />,
  },
  {
    path: "/company/verify",
    element: <CompanyVerificationForm />,
  },
  {
    path: "/company/uploaded-documents",
    element: <Unverified />,
  },
  {
    path : "/company/rejected-documents",
    element: <Rejected />,
  },
  {
    path: "/Admin/Internal/Panel",
    element: isLoggedIn() ? <AdminInternalPanel /> : <Navigate to="/login" />,
  },
  {
    path: "/company/dashboard",
    element: <CompanyAdminlPanel />,
  },
  {
    path: "/job-listings",
    element: <JobListings />,
  },
  {
    path: "/job-listings/:id",
    element: <JobListingsById />,
  },
  {
    path: "/my-applications",
    element: <MyApplications />,
  },
  {
    path:"/profile",
    element: <Profile />
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordFlow />,
  },
  {
    path: "/subscribe",
    element: <SubscribePage />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path:"/success",
    element: <Success />
  },
  {
    path: "/for-employers",
    element: <WelcomeCompany />,
  },
  {
    path: "/my-applications/:id",
    element: <ApplicationsDetails />,
  },
  {
    path: "/*",
    element: <Error404 />,
  },
];

function App() {
  return (
    <Router>
      <div>
        <ErrorBoundary>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>{" "}
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
