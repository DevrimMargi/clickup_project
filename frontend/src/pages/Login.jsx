import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔁 Sayfa açılınca state sıfırla
  useEffect(() => {
    setFormData({
      email: "",
      password: "",
    });
  }, []);

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
      const response = await axios.post(
        "http://localhost:8000/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      const token = response.data.token;
      const workspaceId = response.data.workspace_id;

      localStorage.setItem("token", token);
      navigate(`/workspace/${workspaceId}`);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Giriş başarısız. Bilgilerinizi kontrol edin."
      );
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

        {/* 🔒 AUTOFILL ENGELLEME FORMU */}
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          {/* 🧨 CHROME AUTOFILL TUZAĞI (SAHTE INPUTLAR) */}
          <input
            type="text"
            name="fake-username"
            autoComplete="username"
            tabIndex="-1"
            style={{ position: "absolute", opacity: 0, height: 0 }}
          />

          <input
            type="password"
            name="fake-password"
            autoComplete="current-password"
            tabIndex="-1"
            style={{ position: "absolute", opacity: 0, height: 0 }}
          />

          {/* ✅ GERÇEK INPUTLAR */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            className="border px-4 py-2 rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            className="border px-4 py-2 rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Giriş Yapılıyor..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
