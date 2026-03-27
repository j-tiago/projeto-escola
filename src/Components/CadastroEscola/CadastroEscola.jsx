import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./CadastroEscola.css";

const CadastroEscola = () => {
  const [nome, setNome] = useState("");
  const [diretor, setDiretor] = useState("");
  const [localizacao, setLocalizacao] = useState("1");
  const [turnos, setTurnos] = useState([]);
  const [listaEstados, setListaEstados] = useState([]);
  const [estadoId, setEstadoId] = useState(""); 
  const [listaCidades, setListaCidades] = useState([]);
  const [cidadeId, setCidadeId] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDados, setIsLoadingDados] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const buscarEstados = async () => {
      try {
        const response = await api.get("/estados");
        setListaEstados(response.data);
      } catch (error) {
        console.error("Erro ao carregar estados", error);
      }
    };
    buscarEstados();
  }, []);

  useEffect(() => {
    if (!estadoId) {
      setListaCidades([]);
      return;
    }
    const buscarCidadesPorEstado = async () => {
      try {
        const response = await api.get(`/cidades?estado_id=${estadoId}`);
        setListaCidades(response.data.data || response.data);
      } catch (error) {
        console.error("Erro ao carregar cidades", error);
      }
    };
    buscarCidadesPorEstado();
  }, [estadoId]);

  useEffect(() => {
    if (!id) return;

    const carregarDadosEscola = async () => {
      try {
        setIsLoadingDados(true);
        const response = await api.get(`/escolas/${id}`);
        
        const dados = response.data;
        setNome(dados.nome);
        setDiretor(dados.diretor || ""); 
        setLocalizacao(String(dados.localizacao));

        if (dados.cidade) {
          setEstadoId(dados.cidade.estado_id);
          setCidadeId(dados.cidade_id);
        }

        if (dados.turnos && Array.isArray(dados.turnos)) {
          setTurnos(dados.turnos.map(t => t.turno)); 
        }
      } catch (error) {
        console.error("Erro ao carregar escola", error);
        alert("Erro ao carregar dados.");
        navigate("/home");
      } finally {
        setIsLoadingDados(false);
      }
    };
    carregarDadosEscola();
  }, [id, navigate]);

  const handleTurnoChange = (valor) => {
    if (turnos.includes(valor)) {
      setTurnos(turnos.filter((t) => t !== valor));
    } else {
      setTurnos([...turnos, valor]);
    }
  };

  const handleEstadoSelect = (e) => {
    setEstadoId(e.target.value);
    setCidadeId(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (turnos.length === 0) return alert("Selecione pelo menos um turno.");
    if (!cidadeId) return alert("Selecione uma cidade.");

    setIsSubmitting(true);

    const mapaTurnos = { "Manhã": "M", "Tarde": "T", "Noite": "N", "Integral": "I" };
    const turnosParaEnviar = turnos.map(t => mapaTurnos[t] || t);

    const payload = {
      nome,
      diretor,
      cidade_id: cidadeId,
      localizacao,
      turnos: turnosParaEnviar
    };

    try {
      if (id) {
        await api.patch(`/escolas/${id}`, payload);
        alert("Escola atualizada com sucesso!");
      } else {
        await api.post("/escolas", payload);
        alert("Escola cadastrada com sucesso!");
      }
      navigate("/home");
    } catch (error) {
      console.error("Erro ao salvar", error);
      alert("Erro: " + (error.response?.data?.message || "Falha ao salvar"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cadastro-escola-container">
      <div className="form-card">
        <div className="card-header-title">
          <h2>{id ? "Editar Escola" : "Nova Escola"}</h2>
          <p>{id ? "Altere os dados abaixo." : "Preencha os dados para cadastrar uma nova unidade."}</p>
        </div>

        {isLoadingDados ? (
          <div className="loading-container form-loading">
             <div className="spinner"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome da Escola <span className="required">*</span></label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Nome do Diretor</label>
              <input type="text" value={diretor} onChange={(e) => setDiretor(e.target.value)} placeholder="Opcional" />
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Localização <span className="required">*</span></label>
                <select value={localizacao} onChange={(e) => setLocalizacao(e.target.value)}>
                  <option value="1">Urbana</option>
                  <option value="2">Rural</option>
                </select>
              </div>

              <div className="form-group flex-1">
                <label>Estado <span className="required">*</span></label>
                <select value={estadoId} onChange={handleEstadoSelect} required>
                  <option value="">Selecione...</option>
                  {listaEstados.map((estado) => (
                    <option key={estado.id} value={estado.id}>
                      {estado.sigla} - {estado.descricao}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group flex-2">
                <label>Cidade <span className="required">*</span></label>
                <select 
                  value={cidadeId} 
                  onChange={(e) => setCidadeId(e.target.value)} 
                  required 
                  disabled={!estadoId} 
                >
                  <option value="">{estadoId ? "Selecione uma cidade..." : "Selecione um estado primeiro"}</option>
                  {listaCidades.map((cidade) => (
                    <option key={cidade.id} value={cidade.id}>
                      {cidade.descricao}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="label-turnos">Turnos <span className="required">*</span></label>
              <div className="checkbox-group">
                  {["Manhã", "Tarde", "Noite", "Integral"].map((opcao) => (
                     <label key={opcao} className="checkbox-item">
                        <input 
                            type="checkbox" 
                            checked={turnos.includes(opcao)}
                            onChange={() => handleTurnoChange(opcao)}
                        /> 
                        {opcao}
                     </label>
                  ))}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate("/home")} className="btn-cancelar">Cancelar</button>
              <button 
                  type="submit" 
                  className="btn-salvar" 
                  disabled={isSubmitting} 
              >
                {isSubmitting ? "Salvando..." : (id ? "Salvar Alterações" : "Salvar Escola")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CadastroEscola;