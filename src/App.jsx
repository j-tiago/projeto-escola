import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login.jsx";
import Cadastro from "./Components/Cadastro/Cadastro.jsx";
import Inicio from "./Components/Inicio/Inicio.jsx";
import CadastroEscola from "./Components/CadastroEscola/CadastroEscola.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/home" element={<Inicio />} />

          <Route path="/cadastro" element={<Cadastro />} />

          <Route path="/nova-escola" element={<CadastroEscola />} />

          <Route path="/editar-escola/:id" element={<CadastroEscola />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
