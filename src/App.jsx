import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import SideNav from "./components/SideNav";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Page from "./pages/Page";
import Login from "./pages/Login";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            path=""
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="page"
            element={
              <ProtectedRoute>
                <Page />
              </ProtectedRoute>
            }
          />
          <Route
            path="page1"
            element={
              <ProtectedRoute>
                <Page1 />
              </ProtectedRoute>
            }
          />
          <Route
            path="page2"
            element={
              <ProtectedRoute>
                <Page2 />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const Layout = () => {
  return (
    <div className="wrapper">
      <Navbar />
      <SideNav />
      <Outlet />
      <Footer />
    </div>
  );
};

export default App;
