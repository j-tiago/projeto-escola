import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./CadastroEscola.css";

const CadastroEscola = () => {
  const [nome, setNome] = useState("");
  const [diretor, setDiretor] = useState("");
  const [cidadeId, setCidadeId] = useState(""); 
  const [listaCidades, setListaCidades] = useState([]);
  const [localizacao, setLocalizacao] = useState("1"); 
  const [turnos, setTurnos] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const buscarCidades = async () => {
      try {
        const token = localStorage.getItem("meu_token");
        if (!token) return;

        const response = await axios.get("https://apiteste.mobieduca.me/api/cidades", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setListaCidades(response.data.data || response.data);
      } catch (error) {
        console.error("Erro ao carregar cidades", error);
      }
    };
    buscarCidades();
  }, []);

  useEffect(() => {
    if (id) {
      const carregarDadosEscola = async () => {
        try {
          const token = localStorage.getItem("meu_token");
          const response = await axios.get(`https://apiteste.mobieduca.me/api/escolas/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const dados = response.data;
          
          setNome(dados.nome);
          setDiretor(dados.diretor);
          setLocalizacao(dados.localizacao);
          setCidadeId(dados.cidade_id);

          if (dados.turnos && Array.isArray(dados.turnos)) {
            setTurnos(dados.turnos.map(t => t.turno));
          }

        } catch (error) {
          console.error("Erro ao carregar escola", error);
          alert("Erro ao carregar dados para edição.");
          navigate("/home");
        }
      };
      carregarDadosEscola();
    }
  }, [id, navigate]);

  const handleTurnoChange = (valor) => {
    if (turnos.includes(valor)) {
      setTurnos(turnos.filter((t) => t !== valor));
    } else {
      setTurnos([...turnos, valor]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (turnos.length === 0) {
      alert("Selecione pelo menos um turno.");
      return;
    }

    const mapaTurnos = { "Manhã": "M", "Tarde": "T", "Noite": "N", "Integral": "I" };
    const turnosParaEnviar = turnos.map(t => mapaTurnos[t]);
    const payload = {
      nome,
      diretor,
      cidade_id: cidadeId,
      localizacao,
      turnos: turnosParaEnviar
    };

    try {
      const token = localStorage.getItem("meu_token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (id) {
        await axios.patch(`https://apiteste.mobieduca.me/api/escolas/${id}`, payload, config);
        alert("Escola atualizada com sucesso!");
      } else {
        await axios.post("https://apiteste.mobieduca.me/api/escolas", payload, config);
        alert("Escola cadastrada com sucesso!");
      }
      
      navigate("/home");

    } catch (error) {
      console.error("Erro ao salvar", error);
      alert("Erro: " + (error.response?.data?.message || "Falha ao salvar"));
    }
  };

  return (
    <div className="cadastro-escola-container">
      <div className="form-card">
        <div className="card-header-title">
          <h2>{id ? "Editar Escola" : "Nova Escola"}</h2>
          <p>{id ? "Altere os dados abaixo." : "Preencha os dados para cadastrar uma nova unidade."}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome da Escola <span className="required">*</span></label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Nome do Diretor <span className="required">*</span></label>
            <input type="text" value={diretor} onChange={(e) => setDiretor(e.target.value)} required />
          </div>

          <div className="row">
            <div className="form-group flex-1">
              <label>Localização <span className="required">*</span></label>
              <select value={localizacao} onChange={(e) => setLocalizacao(e.target.value)}>
                <option value="1">Urbana</option>
                <option value="2">Rural</option>
              </select>
            </div>

            <div className="form-group flex-2">
              <label>Cidade <span className="required">*</span></label>
              <select value={cidadeId} onChange={(e) => setCidadeId(e.target.value)} required>
                <option value="">Selecione uma cidade...</option>
                {listaCidades.map((cidade) => (
                  <option key={cidade.id} value={cidade.id}>
                    {cidade.descricao} - {cidade.estado ? cidade.estado.sigla : "UF"}
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
                      /> {opcao}
                   </label>
                ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate("/home")} className="btn-cancelar">Cancelar</button>
            <button type="submit" className="btn-salvar">
              {id ? "Salvar Alterações" : "Salvar Escola"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroEscola;