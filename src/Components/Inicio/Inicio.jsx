import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import "./Inicio.css";

const fetchEscolas = async (page) => {
  const token = localStorage.getItem("meu_token");
  const url = `https://apiteste.mobieduca.me/api/escolas?page=${page}`;
  const { data } = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data; 
};

const Inicio = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { 
    data, 
    isLoading, 
    isError, 
    isPlaceholderData 
  } = useQuery({
    queryKey: ['escolas', page],
    queryFn: () => fetchEscolas(page),
    placeholderData: (previousData) => previousData,
    staleTime: 5000
  });

  const escolas = data?.data || [];
  const totalPages = data?.last_page || 1;
  const totalRegistros = data?.total || 0;
  const handleLogout = () => {
    localStorage.removeItem("meu_token");
    navigate("/");
  };

  if (isError) {
    return (
      <div className="empty-state">
        <p>Sessão expirada ou erro na conexão.</p>
        <button onClick={handleLogout} className="btn-sair" style={{marginTop: 10}}>Fazer Login</button>
      </div>
    );
  }

  return (
    <div className="inicio-container">
      <header className="inicio-header">
        <h1>Sistema de Escolas</h1>
        <div className="header-buttons">
          <Link to="/nova-escola" className="btn-novo">+ Nova Escola</Link>
          <button onClick={handleLogout} className="btn-sair">Sair</button>
        </div>
      </header>

      <main className="inicio-content">
        <div className="titulo-secao">
            <h2>Escolas Cadastradas</h2>
            <p>Total: {totalRegistros}</p>
        </div>
        
        {isLoading && !isPlaceholderData ? (
           <div className="loading-container"><div className="spinner"></div></div>
        ) : escolas.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma escola encontrada.</p>
          </div>
        ) : (
          <>
            <div className="lista-grid">
              {escolas.map((escola) => (
                <div key={escola.id} className="escola-card" style={{ opacity: isPlaceholderData ? 0.6 : 1 }}>
                  <div className="card-header">
                      <h3>{escola.nome}</h3>
                      <button 
                        onClick={() => navigate(`/editar-escola/${escola.id}`)}
                        className="btn-editar"
                      >
                        <FaEdit /> Editar
                      </button>
                  </div>
                  
                  <div className="card-body">
                      <p><strong>Diretor:</strong> {escola.diretor || "Não informado"}</p>
                      <p><strong>Cidade:</strong> {escola.cidade ? escola.cidade.descricao : "Indefinida"}</p>
                      <p><strong>Estado:</strong> {escola.cidade?.estado ? escola.cidade.estado.sigla : "UF"}</p>
                      <p><strong>Turnos:</strong> {
                          Array.isArray(escola.turnos) 
                            ? escola.turnos.map(t => t.turno).join(", ") 
                            : "Não informado"
                      }</p>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button 
                        onClick={() => setPage(old => Math.max(old - 1, 1))} 
                        disabled={page === 1} 
                        className="btn-page"
                    >
                        Anterior
                    </button>
                    <span className="page-info">Página <strong>{page}</strong> de <strong>{totalPages}</strong></span>
                    <button 
                        onClick={() => setPage(old => (old < totalPages ? old + 1 : old))} 
                        disabled={page === totalPages} 
                        className="btn-page"
                    >
                        Próxima
                    </button>
                </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Inicio;