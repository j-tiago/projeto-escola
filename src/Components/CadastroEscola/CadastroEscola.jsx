import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const buscarCidades = async () => {
      try {
        const url = "https://apiteste.mobieduca.me/api/cidades";
        const response = await axios.get(url);
        setListaCidades(response.data);
      } catch (error) {
        console.error("Erro ao carregar cidades", error);
      }
    };
    buscarCidades();
  }, []);

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
      alert("Selecione pelo menos um turno!");
      return;
    }

    try {
      const token = localStorage.getItem("meu_token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const dadosParaAPI = {
        nome: nome,
        diretor: diretor,
        cidade_id: parseInt(cidadeId),
        localizacao: parseInt(localizacao),
        turnos: turnos.map(turno => turno.charAt(0)) 
      };

      console.log("Enviando:", dadosParaAPI); 

      const url = "https://apiteste.mobieduca.me/api/escolas";
      await axios.post(url, dadosParaAPI, config);

      alert("Escola criada com sucesso!");
      navigate("/home");

    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      if(error.response && error.response.data) {
          alert("Erro: " + JSON.stringify(error.response.data));
      } else {
          alert("Erro ao conectar com o servidor.");
      }
    }
  };

  return (
    <div className="cadastro-escola-container">
      <div className="form-card">
        <div className="card-header-title">
            <h2>Cadastrar Nova Escola</h2>
            <p>Preencha os dados abaixo.</p>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div className="form-row">
            <div className="form-group flex-2">
                <label>Nome da Escola <span className="required">*</span></label>
                <input 
                  type="text" 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  required 
                />
            </div>
            <div className="form-group flex-1">
                <label>Diretor</label>
                <input 
                  type="text" 
                  value={diretor} 
                  onChange={(e) => setDiretor(e.target.value)} 
                />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
                <label>Localização <span className="required">*</span></label>
                <select 
                    value={localizacao} 
                    onChange={(e) => setLocalizacao(e.target.value)}
                    required
                >
                    <option value="1">Urbana</option>
                    <option value="2">Rural</option>
                </select>
            </div>

            <div className="form-group flex-2">
              <label>Cidade <span className="required">*</span></label>
              <select 
                value={cidadeId} 
                onChange={(e) => setCidadeId(e.target.value)} 
                required 
              >
                <option value="">Selecione uma cidade...</option>
                {listaCidades.map((cidade) => (
                  <option key={cidade.id} value={cidade.id}>
                    {cidade.nome} - {cidade.estado}
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
            <button type="button" onClick={() => navigate("/home")} className="btn-cancelar">
              Cancelar
            </button>
            <button type="submit" className="btn-salvar">
              Salvar Escola
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CadastroEscola;