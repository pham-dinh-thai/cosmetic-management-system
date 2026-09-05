import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Employee from "./pages/Employee";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Navigate to="/landing" replace />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/employee" element={<Employee />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
