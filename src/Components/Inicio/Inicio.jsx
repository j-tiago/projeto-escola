import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { FaEdit } from "react-icons/fa"; 
import "./Inicio.css";

const Inicio = () => {
  const [escolas, setEscolas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0); 
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("meu_token");
    navigate("/");
  };

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/escolas?page=${page}`);
        const listaReais = response.data.data || (Array.isArray(response.data) ? response.data : []);
        setEscolas(listaReais);
        setTotalPages(response.data.last_page || 1);
        setTotalRegistros(response.data.total || listaReais.length);
        
      } catch (error) {
        console.error("Erro ao buscar escolas:", error);
        if (error.response && error.response.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    buscarDados();
  }, [navigate, page]); 

  const handlePrevPage = () => { if (page > 1) setPage(page - 1); };
  const handleNextPage = () => { if (page < totalPages) setPage(page + 1); };

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
            {!loading && <p>Total: {totalRegistros}</p>}
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : escolas.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma escola encontrada.</p>
          </div>
        ) : (
          <>
            <div className="lista-grid">
              {escolas.map((escola) => (
                <div key={escola.id} className="escola-card">
                  <div className="card-header">
                      <h3>{escola.nome}</h3>
                      <button onClick={() => navigate(`/editar-escola/${escola.id}`)} className="btn-editar">
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
                    <button onClick={handlePrevPage} disabled={page === 1} className="btn-page">Anterior</button>
                    <span className="page-info">Página <strong>{page}</strong> de <strong>{totalPages}</strong></span>
                    <button onClick={handleNextPage} disabled={page === totalPages} className="btn-page">Próxima</button>
                </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Inicio;