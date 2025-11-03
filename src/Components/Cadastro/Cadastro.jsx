import { FaUser, FaLock } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Cadastro.css";

const Cadastro = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [perfil, setPerfil] = useState('aluno');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Dados do Cadastro:', {
      email,
      senha,
      perfil,
    });
  };

  return (
    <div className="cadastro-page">
      <div className="cadastro-container">
        <h2>Cadastro</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="perfil">Tipo de Perfil</label>
            <select
              id="perfil"
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              required
            >
              <option value="aluno">Aluno</option>
              <option value="professor">Professor</option>
              <option value="gestor">Gestor</option>
            </select>
          </div>
          
          <button type="submit" className="submit-btn">Cadastrar</button>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
