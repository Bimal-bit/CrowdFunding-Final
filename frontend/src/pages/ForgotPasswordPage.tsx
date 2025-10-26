import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Add reset password logic here
    alert("Password successfully reset!");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Reset Password
        </h2>

        <form onSubmit={handleReset} className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-600">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-purple-200"
            />
          </div>

          <div>
            <label className="block text-gray-600">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-purple-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
