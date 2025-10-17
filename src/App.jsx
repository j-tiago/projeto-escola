import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Components/Login/Login";
import Inicio from "./Components/Inicio/Inicio";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Inicio />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
