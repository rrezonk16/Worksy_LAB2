import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./Components/Main/Main";
import Error404 from "./Components/ErrorPages/Error404";
import Register from "./Components/Auth/Register";
import Login from "./Components/Auth/Login";
import Welcome from "./Components/Auth/welcome";

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