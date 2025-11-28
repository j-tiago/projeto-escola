import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Inicio.css";

const Inicio = () => {
  const [escolas, setEscolas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("meu_token");
    navigate("/");
  };

  useEffect(() => {
    const buscarDados = async () => {
      const token = localStorage.getItem("meu_token");
      
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const url = "https://apiteste.mobieduca.me/api/escolas";
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const response = await axios.get(url, config);

        console.log("Resposta da API:", response.data);

        let listaCorreta = [];
        
        if (response.data && Array.isArray(response.data.data)) {
            listaCorreta = response.data.data;
        } else if (Array.isArray(response.data)) {
            listaCorreta = response.data;
        }
        
        setEscolas(listaCorreta);
        setLoading(false);

      } catch (error) {
        console.error("Erro ao buscar:", error);
        if (error.response && error.response.status === 401) {
          handleLogout();
        }
        setLoading(false);
      }
    };

    buscarDados();
  }, [navigate]);

  if (loading) {
    return <div className="loading-container">Carregando escolas...</div>;
  }

  return (
    <div className="inicio-container">
      <header className="inicio-header">
        <h1>Sistema de Escolas</h1>

        <div className="header-buttons">
          <Link to="/nova-escola" className="btn-novo">
            + Nova Escola
          </Link>
          <button onClick={handleLogout} className="btn-sair">
             Sair
          </button>
        </div>
      </header>

      <main className="inicio-content">
        <div className="titulo-secao">
            <h2>Escolas Cadastradas</h2>
            <p>Total encontradas: {escolas.length}</p>
        </div>
        
        {escolas.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma escola encontrada.</p>
          </div>
        ) : (
          <div className="lista-grid">
            {escolas.map((escola) => (
              <div key={escola.id} className="escola-card">
                <div className="card-header">
                    <h3>{escola.nome}</h3>
                </div>
                <div className="card-body">
                    <p><strong>Cidade:</strong> {escola.cidade || "Não informada"}</p>
                    <p><strong>Estado:</strong> {escola.estado || "UF"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Inicio;