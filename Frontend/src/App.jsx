import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Error404 from "./Components/ErrorPages/Error404";
import Register from "./Components/Auth/Register";
import Login from "./Components/Auth/Login";
import AdminInternalPanel from "./Components/Admin/Intern/AdminInternalPanel";
import Main from "./Components/Main/Main";
import CompanyVerificationForm from "./Components/Auth/CompanyVerificationForm";
import CompanyPanelLogin from "./Components/Auth/CompanyPanelLogin";
;


const routes = [
  {
    path: "/",
    element: <Main/>
  },
  {
    path: "/register",
    element: <Register/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/company/panel/login",
    element : <CompanyPanelLogin/>
  },
  {
    path: "/company/verify",
    element: <CompanyVerificationForm/>
  },
  {
    path: "/Admin/Internal/Panel",
    element: <AdminInternalPanel/>
  },
  {
    path: "/*",
    element: <Error404/>
  }
];


function App() {
  
  return (
    <Router>

      <div>

        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </div>
    </Router>
  );
}

export default App;