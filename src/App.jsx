import Navbar from "./components/Navbar";
import SideNav from "./components/SideNav";
import Footer from "./components/Footer";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useNavigate,
} from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DataLensa from "./pages/DataLensa";
import Pasien from "./pages/Pasien";
import RekamMedis from "./pages/RekamMedis";
import Garansi from "./pages/Garansi";
import KlaimGaransi from "./pages/KlaimGaransi";
import DaftarAkun from "./pages/DaftarAkun";
import PengaturanAkun from "./pages/PengaturanAkun";
import StokLensa from "./pages/StokLensa";
import Error404 from "./pages/Error404";
import DataOptik from "./pages/DataOptik";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import CekStokLensa from "./pages/CekStokLensa";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userToken = localStorage.getItem("user-ma-token");
    if (userToken) {
      const decode = jwtDecode(userToken);
      if (decode.user.role == "admin") {
        setIsAdmin(true);
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout isAdmin={isAdmin} />
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
            path="cek-stok-lensa-1"
            element={
              <ProtectedRoute>
                <CekStokLensa />
              </ProtectedRoute>
            }
          />
          <Route
            path="cek-stok-lensa-2"
            element={
              <ProtectedRoute>
                <DataLensa />
              </ProtectedRoute>
            }
          />
          <Route
            path="stok-lensa/:id"
            element={
              <ProtectedRoute>
                <StokLensa isAdmin={isAdmin} />
              </ProtectedRoute>
            }
          />
          <Route
            path="pasien"
            element={
              <ProtectedRoute>
                <Pasien />
              </ProtectedRoute>
            }
          />
          <Route
            path="rekam-medis"
            element={
              <ProtectedRoute>
                <RekamMedis />
              </ProtectedRoute>
            }
          />
          <Route
            path="garansi"
            element={
              <ProtectedRoute>
                <Garansi />
              </ProtectedRoute>
            }
          />
          <Route
            path="klaim-garansi"
            element={
              <ProtectedRoute>
                <KlaimGaransi />
              </ProtectedRoute>
            }
          />
          <Route
            path="data-optik"
            element={
              <ProtectedRoute>
                <DataOptik />
              </ProtectedRoute>
            }
          />
          {/* {isAdmin && (
            <Route
              path="daftar-akun"
              element={
                <ProtectedRoute>
                  <DaftarAkun />
                </ProtectedRoute>
              }
            />
          )} */}

          <Route
            path="pengaturan-akun"
            element={
              <ProtectedRoute>
                <PengaturanAkun />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

const Layout = ({ isAdmin }) => {
  return (
    <div className="wrapper">
      <Navbar />
      <SideNav isAdmin={isAdmin} />
      <Outlet />
      <Footer />
    </div>
  );
};

export default App;
