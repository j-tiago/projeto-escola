import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import "./CadastroEscola.css";

const fetchEstados = async () => {
  const token = localStorage.getItem("meu_token");
  const { data } = await axios.get("https://apiteste.mobieduca.me/api/estados", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

const fetchCidades = async (estadoId) => {
  const token = localStorage.getItem("meu_token");
  const { data } = await axios.get(`https://apiteste.mobieduca.me/api/cidades?estado_id=${estadoId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data.data || data;
};

const fetchEscolaDetalhes = async (id) => {
  const token = localStorage.getItem("meu_token");
  const { data } = await axios.get(`https://apiteste.mobieduca.me/api/escolas/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

const CadastroEscola = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [nome, setNome] = useState("");
  const [diretor, setDiretor] = useState("");
  const [localizacao, setLocalizacao] = useState("1");
  const [turnos, setTurnos] = useState([]);
  const [estadoId, setEstadoId] = useState(""); 
  const [cidadeId, setCidadeId] = useState(""); 
  const { data: listaEstados = [] } = useQuery({
    queryKey: ['estados'],
    queryFn: fetchEstados,
    staleTime: Infinity, 
  });

  const { data: listaCidades = [] } = useQuery({
    queryKey: ['cidades', estadoId],
    queryFn: () => fetchCidades(estadoId),
    enabled: !!estadoId,
    staleTime: 1000 * 60 * 5,
  });

  const { data: dadosEscola, isLoading: isLoadingDados } = useQuery({
    queryKey: ['escola', id],
    queryFn: () => fetchEscolaDetalhes(id),
    enabled: !!id,
    retry: false,
  });

  useEffect(() => {
    if (dadosEscola) {
      setNome(dadosEscola.nome);
      setDiretor(dadosEscola.diretor || "");
      setLocalizacao(String(dadosEscola.localizacao));
      
      if (dadosEscola.cidade) {
        setEstadoId(dadosEscola.cidade.estado_id);
        setCidadeId(dadosEscola.cidade_id);
      }

      if (dadosEscola.turnos && Array.isArray(dadosEscola.turnos)) {
        setTurnos(dadosEscola.turnos.map(t => t.turno));
      }
    }
  }, [dadosEscola]);

  const mutation = useMutation({
    mutationFn: async (novoCadastro) => {
      const token = localStorage.getItem("meu_token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (id) {
        return axios.patch(`https://apiteste.mobieduca.me/api/escolas/${id}`, novoCadastro, config);
      } else {
        return axios.post("https://apiteste.mobieduca.me/api/escolas", novoCadastro, config);
      }
    },
    onSuccess: () => {

      queryClient.invalidateQueries(['escolas']); 
      alert(id ? "Escola atualizada!" : "Escola cadastrada!");
      navigate("/home");
    },
    onError: (error) => {
      console.error("Erro ao salvar", error);
      alert("Erro: " + (error.response?.data?.message || "Falha ao processar"));
    }
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (turnos.length === 0) return alert("Selecione pelo menos um turno.");
    if (!cidadeId) return alert("Selecione uma cidade.");

    const mapaTurnos = { "Manhã": "M", "Tarde": "T", "Noite": "N", "Integral": "I" };
    const turnosParaEnviar = turnos.map(t => mapaTurnos[t] || t);

    mutation.mutate({
      nome,
      diretor,
      cidade_id: cidadeId,
      localizacao,
      turnos: turnosParaEnviar
    });
  };

  if (isLoadingDados) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

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
            <label>Nome do Diretor</label>
            <input 
              type="text" 
              value={diretor} 
              onChange={(e) => setDiretor(e.target.value)} 
              placeholder="Opcional"
            />
          </div>

          <div className="row" style={{ display: 'flex', gap: '20px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Localização <span className="required">*</span></label>
              <select value={localizacao} onChange={(e) => setLocalizacao(e.target.value)}>
                <option value="1">Urbana</option>
                <option value="2">Rural</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
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

            <div className="form-group" style={{ flex: 2 }}>
              <label>Cidade <span className="required">*</span></label>
              <select 
                value={cidadeId} 
                onChange={(e) => setCidadeId(e.target.value)} 
                required 
                disabled={!estadoId} 
                style={{ backgroundColor: !estadoId ? '#f3f4f6' : '#fff' }}
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
                disabled={mutation.isPending} 
                style={{ opacity: mutation.isPending ? 0.7 : 1, cursor: mutation.isPending ? 'not-allowed' : 'pointer' }}
            >
              {mutation.isPending ? "Salvando..." : (id ? "Salvar Alterações" : "Salvar Escola")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroEscola;