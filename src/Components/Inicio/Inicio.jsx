import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Inicio.css";

const Inicio = () => {
  const [escolas, setEscolas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Novos estados para paginação
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
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
        setLoading(true);
        // Adicionamos o parâmetro ?page= para a API saber qual página queremos
        const url = `https://apiteste.mobieduca.me/api/escolas?page=${page}`;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const response = await axios.get(url, config);

        // Debug para confirmar estrutura
        console.log("Dados da API:", response.data);

        // 1. A lista real está dentro de response.data.data
        setEscolas(response.data.data || []);
        
        // 2. Pegamos o total de páginas para controlar os botões
        setTotalPages(response.data.last_page || 1);
        
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
  }, [navigate, page]); // O useEffect roda de novo sempre que 'page' mudar

  // Funções para mudar de página
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

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
            {/* Mostra em qual página estamos */}
            <p>Página {page} de {totalPages}</p>
        </div>
        
        {escolas.length === 0 ? (
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
                  </div>
                  <div className="card-body">
                      <p><strong>Diretor:</strong> {escola.diretor || "Não informado"}</p>
                      {/* CORREÇÃO AQUI: Acessando os objetos conforme o JSON */}
                      <p><strong>Cidade:</strong> {escola.cidade?.descricao || "Indefinida"}</p>
                      <p><strong>Estado:</strong> {escola.cidade?.estado?.sigla || "UF"}</p>
                      <p><strong>Turnos:</strong> {
                          /* O JSON mostra turnos como array de objetos, vamos tratar isso */
                          Array.isArray(escola.turnos) 
                            ? escola.turnos.map(t => t.turno).join(", ") 
                            : "Não informado"
                      }</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CONTROLES DE PAGINAÇÃO */}
            <div className="pagination-controls">
                <button 
                    onClick={handlePrevPage} 
                    disabled={page === 1}
                    className="btn-page"
                >
                    Anterior
                </button>
                <span>{page} / {totalPages}</span>
                <button 
                    onClick={handleNextPage} 
                    disabled={page === totalPages}
                    className="btn-page"
                >
                    Próxima
                </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Inicio;