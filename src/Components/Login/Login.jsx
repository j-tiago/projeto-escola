import { FaUser, FaLock } from "react-icons/fa";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      alert("Preencha os campos corretamente.");
      return;
    }
    try {
      const response = await axios.post("https://apiteste.mobieduca.me/api/login/run", {
        email: username, 
        senha: password
      });
      const token = response.data.token || response.data.accessToken;
      if (token) localStorage.setItem("meu_token", token);
      navigate("/home");
    } catch (error) {
      alert("Erro ao logar: " + (error.response?.data?.message || "Verifique suas credenciais"));
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <h1>Faça o Login</h1>
          <div className="input-field">
            <input type="email" placeholder="E-mail" value={username} onChange={(e) => setUsername(e.target.value)} />
            <FaUser className="icon" />
          </div>
          <div className="input-field">
            <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
            <FaLock className="icon" />
          </div>
          <div className="recall-forget">
            <label><input type="checkbox" /> Lembre de mim</label>
            <a href="#">Esqueci minha senha</a>
          </div>
          <button type="submit" className="entrar">Entrar</button>
          <div className="signup-link">
            <p>Não tem uma conta? <Link to="/cadastro">Registrar</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;