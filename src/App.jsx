import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Components/Login/Login";
import Cadastro from "./Components/Cadastro/cadastro.jsx";
import Inicio from "./Components/Inicio/Inicio";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/home" element={<Inicio />} />

          <Route path="/cadastro" element={<Cadastro />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
