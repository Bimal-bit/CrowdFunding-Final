import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import DashboardPage from "./pages/DashboardPage";

// 👇 Import the new auth pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminCreateProject from "./pages/AdminCreateProject.tsx";
import AboutPage from "./pages/AboutPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/create" element={<CreateProjectPage />} />
            <Route path="/project/:id" element={<ProjectDetailPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* 👇 New Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/about" element={<AboutPage />} />
            
            {/* Payment Success Route */}
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/create-project" element={<AdminCreateProject />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;