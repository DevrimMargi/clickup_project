import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function InviteSignup() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [workspace, setWorkspace] = useState(null);
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:8000/invite/accept/${token}`)
      .then(res => {
        setEmail(res.data.email);
        setWorkspace(res.data.workspace_id);
      });
  }, [token]);

  const handleSignup = async () => {
    const res = await axios.post("http://localhost:8000/invite/signup", {
      full_name: fullName,
      email,
      password,
      token
    });

    navigate(`/workspace/${res.data.workspace_id}`);
  };

  return (
    <div className="p-10">
      <h1>Workspace'e Katıl</h1>

      <input
        type="text"
        placeholder="Ad Soyad"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <input
        type="email"
        value={email}
        disabled
      />

      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSignup}>
        Katıl
      </button>
    </div>
  );
}
