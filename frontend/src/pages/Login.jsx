import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Yönlendirme için
import axios from 'axios'; // API çağrıları için (Kurulu olduğunu varsayıyorum)

export default function Login() {
  // 1. Form Durumunu Yönetme (State Management)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Durumlar
  const [loading, setLoading] = useState(false); // Yüklenme durumu
  const [error, setError] = useState(null);       // Hata mesajı

  const navigate = useNavigate(); // Yönlendirme hook'u

  // 2. Form Değişikliklerini Yakalama (handleChange)
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 3. Giriş İşlemini Yönetme (handleSubmit)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini engelle
    setLoading(true);
    setError(null);

    // Basit bir alan boş kontrolü
    if (!formData.email || !formData.password) {
      setError('Lütfen tüm alanları doldurunuz.');
      setLoading(false);
      return;
    }

    try {
      // API uç noktanızı ve veriyi güncelleyin
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      // Başarılı giriş
      const token = response.data.token;
      
      // Token'ı yerel depolamaya (localStorage) kaydet
      localStorage.setItem('authToken', token);

      // (Opsiyonel: Global Auth Context'i burada güncelleyebilirsiniz)
      
      // 4. Yönlendirme: Başarılı girişten sonra Dashboard'a yönlendir
      navigate('/dashboard'); 

    } catch (err) {
      // Hata durumunda
      const errorMessage = err.response?.data?.message || 'Giriş başarısız oldu. Lütfen bilgilerinizi kontrol edin.';
      setError(errorMessage);
      console.error('Giriş Hatası:', err);
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

        {/* Hata Mesajı Gösterme */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Formu handleSubmit fonksiyonuna bağlama */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          
          <input
            type="email"
            name="email" // State yönetimi için gerekli
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading} // Yüklenirken girişi devre dışı bırak
            className="border px-4 py-2 rounded-lg focus:outline-blue-500"
          />

          <input
            type="password"
            name="password" // State yönetimi için gerekli
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading} // Yüklenirken girişi devre dışı bırak
            className="border px-4 py-2 rounded-lg focus:outline-blue-500"
          />

          {/* Yüklenme durumunda butonu devre dışı bırakma ve metni değiştirme */}
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {/* 5. Durum (Loading) Gösterme */}
            {loading ? 'Giriş Yapılıyor...' : 'Login'}
          </button>
        </form>

      </div>
    </div>
  );
}