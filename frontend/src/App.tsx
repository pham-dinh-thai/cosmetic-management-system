import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthProvider";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Employee from "./pages/Employee";
import ProductDetail from "./pages/ProductDetail";
import ProfilePage from "./pages/Profile";
import NotFound from "./pages/NotFound";
import RoleRoute from "./components/RoleRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/product/:code" element={<ProductDetail />} />
          <Route
            path="/profile"
            element={
              <RoleRoute allowedRoles={["admin", "employee", "customer"]}>
                <ProfilePage />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <Admin />
              </RoleRoute>
            }
          />
          <Route
            path="/employee"
            element={
              <RoleRoute allowedRoles={["employee"]}>
                <Employee />
              </RoleRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#fcfcf7",
            color: "#1c3a13",
            border: "1px solid #1c3a13",
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
