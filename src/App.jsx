import Navbar from "./components/Navbar";
import SideNav from "./components/SideNav";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StokLensa from "./pages/StokLensa";
import Pasien from "./pages/Pasien";
import RekamMedis from "./pages/RekamMedis";
import Garansi from "./pages/Garansi";
import KlaimGaransi from "./pages/KlaimGaransi";
import DaftarAkun from "./pages/DaftarAkun";
import PengaturanAkun from "./pages/PengaturanAkun";

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
            path="stok-lensa"
            element={
              <ProtectedRoute>
                <StokLensa />
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
            path="daftar-akun"
            element={
              <ProtectedRoute>
                <DaftarAkun />
              </ProtectedRoute>
            }
          />
          <Route
            path="pengaturan-akun"
            element={
              <ProtectedRoute>
                <PengaturanAkun />
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
