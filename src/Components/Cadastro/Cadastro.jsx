import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cadastro.css";

const Cadastro = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [perfil, setPerfil] = useState('aluno');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados:', { email, senha, perfil });
  };

  return (
    <div className="auth-page-wrapper">
      <div className="cadastro-container">
        <h2>Cadastro</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Perfil</label>
            <select value={perfil} onChange={(e) => setPerfil(e.target.value)}>
              <option value="aluno">Aluno</option>
              <option value="professor">Professor</option>
              <option value="gestor">Gestor</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">Cadastrar</button>
          <button type="button" className="btn-voltar" onClick={() => navigate("/")}>Voltar</button>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;