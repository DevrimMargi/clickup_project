import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordAgain) {
      alert("Şifreler uyuşmuyor!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/auth/signup",
        {
          full_name: fullName,
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert(response.data.message || "Kayıt başarılı!");

      // Backend'in döndürdüğü token ve workspace id'yi al
      const token = response.data.token;
      const workspaceId = response.data.workspace_id;

      // Token'ı localStorage'a kaydet (giriş yapılmış oluyor)
      localStorage.setItem("token", token);

      // ✔ Signup sonrası otomatik workspace sayfasına yönlendir
      navigate(`/workspace/${workspaceId}`);

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.detail || "Bir hata oluştu");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-blue-100 px-4">
      <div className="w-full max-w-sm bg-white shadow-2xl rounded-2xl p-7 border border-blue-100">

        <div className="flex justify-center mb-3 text-blue-500 text-5xl">
          <span>📝</span>
        </div>

        <h2 className="text-2xl font-extrabold text-center text-gray-800">
          Hesabınızı Oluşturun
        </h2>

        <p className="text-center text-gray-500 mt-1 mb-6 text-sm">
          Hızlıca ücretsiz bir hesap oluşturun.
        </p>

        <form className="space-y-3" onSubmit={handleSubmit}>

          <div>
            <label className="text-gray-700 font-medium text-sm">Adınız Soyadınız</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2.5 rounded-lg bg-gray-100 border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium text-sm">E-posta Adresi</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2.5 rounded-lg bg-gray-100 border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium text-sm">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full mt-1 px-4 py-2.5 rounded-lg bg-gray-100 border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium text-sm">Şifre Tekrarı</label>
            <input
              type="password"
              value={passwordAgain}
              onChange={(e) => setPasswordAgain(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2.5 rounded-lg bg-gray-100 border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-3 text-white font-semibold text-md rounded-lg 
            bg-blue-600 hover:bg-blue-700 transition shadow-md"
          >
            Hesap Oluştur
          </button>
        </form>

        <p className="text-center text-gray-600 mt-5 text-sm">
          Zaten bir hesabınız var mı?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            Giriş Yap
          </span>
        </p>
      </div>
    </div>
  );
}
