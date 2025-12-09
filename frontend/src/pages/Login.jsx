import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.email || !formData.password) {
      setError("Lütfen tüm alanları doldurun.");
      setLoading(false);
      return;
    }

    try {
      // ✔ DOĞRU BACKEND URL
      const response = await axios.post(
        "http://localhost:8000/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      console.log("Login Response:", response.data);

      const token = response.data.token;
      const workspaceId = response.data.workspace_id;

      // ✔ token kaydet
      localStorage.setItem("token", token);

      // ✔ otomatik workspace'e git
      navigate(`/workspace/${workspaceId}`);

    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        "Giriş başarısız. Bilgilerinizi kontrol edin.";

      setError(errorMessage);
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md">

        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Login
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            className="border px-4 py-2 rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            className="border px-4 py-2 rounded-lg"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Giriş Yapılıyor..." : "Login"}
          </button>
        </form>

      </div>
    </div>
  );
}
